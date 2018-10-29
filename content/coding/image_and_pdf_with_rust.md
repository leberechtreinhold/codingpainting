---
title: "Image and pdf manipulation with rust"
date: 2018-09-10
tags: ["programming", "rust"]
---

*Trying to use Rust to make a very small program that reads a bunch of scanned pages from a book, divides them, and finally create a PDF with the result.*

<!--more--> 

## The case for Rust

I have recently started with Rust, a wonderful language which puts safety. Since I work constantly with C, usually in environments where C++ (or at least, not a modern flavour) is not available, like Windows drivers, this sounds super attractive. Debugging kernel dumps is super time consuming, especially if they involve stack corruption. Leaks and all are also very annoying.

While starting with Rust is a bit tough, there's a really wonderful community, the Rust book is great and there's lots of blogs on concepts like borrow checker. However, there's less so on libraries, and there's not many complete examples of practical problems. There's also a shit ton of crates to choose for a particular problem, and it can be daunting to choose.

This is kinda understandable since it's a system programming language, and for those, you usually don't make small programs. But I think Rust changes a bit this: It has a great package manager, it has a lot of great libs, it's not that much more difficult to write, and it has great targets. A situation I find myself at work very often is the need of a small tool that can run in many client machines. 

The first idea is usally some python script, which is great for dev, but none of the environments I'm going to deploy the tool is going to have the interpreter. There's the option of freezing but with some dependencies it's a pain. Similarly, things like Java go out of the Window. .NET can be okay, but it can be hard to target, since installations are really diverse. C++ is usually the answer, but generating quickly dependencies it's a bit of a pain for a small tool. Furthermore, there's always stuff like forgetting to set the toolset and suddenly the Windows XP machines don't run the program anymore. Rust however more or less fits here, mostly thanks to cargo.

This post is basically for people new to rust, or people who are thinking of trying it, so they can see how succint and useful it can be for quick tools.

## The problem

The most important part of problem solving is knowing the problem. In this case it was nothing work related: my mother scanned images from a book a friend left her, and wanted an easy formated to read them. The images were ordered, but some were single, some were double and the size wasn't terrible consistent. I decided that this opportunity was good to test things I haven't even touched in rust, and PDF generation is something that is very lacking in many languages.

So we have: a folder with a bunch of JPGs, numbered 001 to 116. And we want to produce a book.pdf with all the pages, set to A4.

## Processing the images

The very first thing we are going to do is create a project, use the [Raster](https://docs.rs/raster/0.2.0/raster/) library to read the images and process each. To make things easier to test, we select one image first, and start testing with it.

Let's say it's a double page, and we want to separate it in two images. Cropping it by half leads to a good result here, and it can be done easily in rust:

{{< highlight rust >}}

let original_img = raster::open("tests/page.jpg").unwrap();
let mut left_page = original_img.clone();

let page_division = image.width / 2;
let height = image.height;

editor::crop(&mut left_page, page_division, height, 
    PositionMode::TopLeft, 0, 0).unwrap();
raster::save(&left_page, "tests/out/left_page.png").unwrap();

// Divide by half
let mut right_page = original_img.clone();

editor::crop(&mut right_page, image.width - page_division, height, 
    PositionMode::TopLeft, page_division, 0).unwrap();
raster::save(&right_page, "tests/out/right_page.jpg").unwrap();

{{< / highlight >}}


However, for many scanned images, this wasn't the case. Since the binding of the book can make each page on a different angle, the division of the pages was a bit off. Since a scanner sets the value by light, we can assume that that the middle of the book, where the binding is, is the darkest part, since it's the part not making contact with the scanner. This division may not be uniform however, so we have to find the average middle.

Which is very easy in Rust! First, we will use grayscale images, since we don't care for color in this case (although it could be useful if you have a more problematic dataset). Then we iterate from each row, getting the index of the darkest pixel.


{{< highlight rust >}}

// Convert to grayscale
let mut image = original_img.clone();
filter::grayscale(&mut image).unwrap();

let w = image.width;
let h = image.height;

let mut indexes: Vec<i32> = Vec::new();

// Get the darkest pixel of each row
for row in 0..h as i32 {
    let mut darkest_pixel = image.get_pixel(0, row).unwrap().r;
    let mut darkest_pixel_idx = 0;

    for col in 1..w as i32 {
        let new_pixel = image.get_pixel(col, row).unwrap().r;

        if new_pixel < darkest_pixel {
            darkest_pixel = new_pixel;
            darkest_pixel_idx = col;
        }
    }
    indexes.push(darkest_pixel_idx);
}

// Calculate the mean
indexes.sort();
let page_division = indexes[indexes.len() / 2];

{{< / highlight >}}


And that's it! However... this isn't getting great results. Since we use the first dark pixel, lots of times this leads to early cropping. The page division is darker, yes, but single black spots appear as noise. While in more problematic datasets we could use some filter to reduce noise, use color information.. etc, in this case we can just be a bit more clever with the crop, and get the closest to the middle of the image. We can also reduce lookup by starting from the first third of the image to the second, skipping a good part of it.

{{< highlight rust >}}

let mut image = original_img.clone();
filter::grayscale(&mut image).unwrap();

let w = image.width;
let h = image.height;

let start_w = w / 3;
let end_w = (w * 2) / 3;
let middle = w / 2;

let mut indexes: Vec<i32> = Vec::new();

for row in 0..h as i32 {
    let mut darkest_pixel = image.get_pixel(start_w, row).unwrap().r;
    let mut darkest_pixel_idx = start_w;

    for col in start_w + 1..end_w as i32 {
        let new_pixel = image.get_pixel(col, row).unwrap().r;

        if new_pixel < darkest_pixel {
            darkest_pixel = new_pixel;
            darkest_pixel_idx = col;
        }
        else if new_pixel == darkest_pixel {
            if (col - middle).abs() < (darkest_pixel_idx - middle).abs() {
                darkest_pixel_idx = col;
            }
        }
    }
    indexes.push(darkest_pixel_idx);
}
indexes.sort();
let page_division = indexes[indexes.len() / 2];

{{< / highlight >}}

That works great for most images... but not for some! And I couldn't figure it out. Was my program buggy, or my logic? Well, the good thing about image processing is that you can just visualize the steps you are taking, and see what happens! 


{{< highlight rust >}}

let mut debug_image = image.clone();

for row in 0..h as i32 {
    // ...
    
    debug_image.set_pixel(darkest_pixel_idx, row, raster::Color::red()).unwrap();
}
raster::save(&debug_image, "debug.png").unwrap();

{{< / highlight >}}

Now we have a bunch of red dots pointing straight to the problem: We are getting the darkest pixel per row, and since the background is white, the binding zone becames dark, but not completely black, as some of the drawings in the book are.

To me this pointed two problems: Doing this per row instead of per column is stupid, and using the minimum (darkest) instead of average/accumulative, doubly so. So I readapted the algorithm. It would still fail if there was suddenly a full black image near the border. In that case, going by darkness would not be enough, and we would need additional postprocessing, to detect gradients or something else. Thankfully, this wasn't the case.

{{< highlight rust >}}

let mut sum_darkness: Vec<i32> = Vec::new();

for col in start_w + 1..end_w {
    let mut counter = 0i32;
    for row in 0..h {
        counter += image.get_pixel(col, row).unwrap().r as i32;
    }
    sum_darkness.push(counter);
}

let page_division = sum_darkness.iter().enumerate().fold(
    (0usize, i32::max_value()),
    |accum, (idx, val)|
    if val < &accum.1 {
        (idx, *val)
    }
    else {
        accum
    }
).0 as i32 + start_w;

{{< / highlight >}}

Getting the index of the minimum is the majority of the code, even if it's fairly simple: we iterate over all values (iter()) accompanied by the index (using enumerate()), and for each we keep a value (accum), initialized by (0, max_int): if we find a smaller value, we set that as the minimum, including the index, otherwise, we keep it as is. And finally, we just retrieve the index. Note that since we didn't start as 0, we need to add the offset!

However, sometimes the pages are not double, but single. Well, that can be fixed easily for this case, since they are A4!

{{< highlight rust >}}

let original_img = raster::open(input_path).unwrap();
let w = original_img.width;
let h = original_img.height;

if w < h {
    return;
}

{{< / highlight >}}

Finally we want to set all images to the same size, since we are going to put it in the PDF. Given the resolution of the input, 72DPI sounds fine, so we want 595x842. We definitively don't want to stretch the image, so we just resize as much as we can then fill the rest with white (to avoid wasting ink).


{{< highlight rust >}}

fn img_to_a4(img: &mut Image) {

    let mut background = raster::Image::blank(595, 842);
    editor::fill(&mut background, raster::Color::white()).unwrap();

    editor::resize(img, 595, 842, raster::ResizeMode::Fit).unwrap();
    *img = editor::blend(&background, &img, 
        raster::BlendMode::Normal, 1.0, PositionMode::Center, 0, 0)
        .unwrap();
}

{{< / highlight >}}



## File stuff

One of the most important parts of any tooling program is managing files, easily, which tends to be one of the biggest pain points on C vs languages like C# or Python. Rust however has the wonder std::path::Path.

{{< highlight rust >}}

let in_path = Path::new("./tests/input/");
for entry in in_path
    .read_dir()
    .expect("Cannot read the input path. \
            Check for existance and privileges.") {
    if let Ok(entry) = entry {
        if entry.file_type().unwrap().is_file() {
            println!("{:?}", entry.path());
        }
    }
}

{{< / highlight >}}

A bit more verbose than in a language like Python, but still fairly short. Note that the order in read_dir is not specific, very much like other directory iterators in other programs. But since we have that information in the filename, we can just parse it, and build a mapping from the page index, to the path of the image.

{{< highlight rust >}}

let mut file_mapping: HashMap<i32, PathBuf> = HashMap::new();
for entry in in_path
    .read_dir()
    .expect("Cannot read the input path. \
            Check for existance and privileges.") {
    if let Ok(entry) = entry {
        if entry.file_type().unwrap().is_file() {
            let filename =  entry.path().file_stem().unwrap()
                .to_owned().into_string().unwrap();
            println!("{}", filename);
            let index = filename.parse::<i32>().unwrap();
            
            let path = entry.path().to_owned();
            file_mapping.insert(index, path);
        }
    }
}

{{< / highlight >}}

That was significantly more verbose than what I hoped, especially the PathBuf part, which is fine with PathBufs but not as nice if you decide to use Path instead. It makes sense, but the error is hardly intuitive. See [this open issue](https://github.com/rust-lang/rust/issues/23286). However since I'm fairly new to Rust there are probably more succint ways to make this (maybe doing a map over the read_dir()? Would still have the same problem with the path/strings/OsString types, which can be confusing).

Anyhow, let's just get those keys, and sort them to process images in order:

{{< highlight rust >}}

let mut scans: Vec<i32> = file_mapping.keys().map(|&x| x).collect();
scans.sort();

for scan in scans {
    // Process image!
}

{{< / highlight >}}

So that's basically everything! We just keep an index and we increment it by one or two depending on the processing and that's it! And we can see how easy is to format strings with the fmt module:

{{< highlight rust >}}

let output_name = format!("{:0>4}.png", index.to_string());
let output_path = output_folder.join(output_name);
raster::save(&original_img, output_path.to_str().unwrap());
return index + 1;

{{< / highlight >}}



## Generating the PDF

This part was easy, but frustrating. The general idea is we create a PDF, and add pages with the image:

{{< highlight rust >}}

let (doc, _page1, _layer1) = PdfDocument::new("result", 
    Mm(210.0), Mm(297.0), "Layer 1");
    
let mut current_layer = doc.get_page(_page1).get_layer(_layer1);

for entry in out_path.read_dir().unwrap() {
    let entry = entry.expect("Couldn't read the output generated.");
    let mut image_file = File::open(entry.path()).unwrap();
    let decoder = image::jpeg::JPEGDecoder::new(&mut image_file);
    let image = printpdf::Image::try_from(decoder).unwrap();

    image.add_to_layer(current_layer.clone(), 
        None, None, None, None, None, None);
        
    let (_page, _layer) = doc.add_page(Mm(210.0), Mm(297.0), "Layer 1");
    current_layer = doc.get_page(_page).get_layer(_layer);
}
doc.save(&mut BufWriter::new(File::create("result.pdf").unwrap())).unwrap();

{{< / highlight >}}

The code is short and simple, so what's the problem? Well, the library only supports JPEG or BMP, so no PNG. That's not a big limitation but we have to change the previous part to output a JPEG (because it didn't support BMP...). Furthermore, it doesn't compress unless in release mode. And the worst part, JPEG doesn't work in release mode!

So the only left was writing JPEGs in debug and adding it to the PDF, which was ridiculously big: 2 pages resulted in a 50MB file!

We can alter the image.add_to_layer() to generate the images at 72 dpi and then reescale to 300dpi, but the file is still fairly big, especially when the final output would be 200+ pages. So compression is definitively needed, therefore, we need BMP, which isn't supported by the crate raster (which funnily enugh, doesn't list ther supported formats in the doc). So we have to switch libraries... there's not many alternatives to printpdf, so we will have to change raster for image (which is the one that printpdf also uses).

### Switching from raster to image

The image crate is definitively not as easy to use as raster. It lacks some of the functionality we had as easy to use functions, like the resize with resizemode::fit, and it also lacks the cool documentation with examples that raster has. Furthermore, even some of the methods that sound like they may work, it ends up not supporting many formats, like [save](https://docs.rs/image/0.19.0/image/struct.ImageBuffer.html#method.save), which only supports jpeg and png.


Open/Save image:

{{< highlight rust >}}
// OLD
let original_img = raster::open(input.to_str().unwrap()).unwrap();

raster::save(&img, path.to_str().unwrap()).unwrap();

// NEW
let original_img = image::open(input.to_str().unwrap()).unwrap();
image::ImageRgba8(right_page).save(path).unwrap();

{{< / highlight >}}

Convert to grayscale:

{{< highlight rust >}}
// OLD
let mut image = original_img.clone();
filter::grayscale(&mut image).unwrap();

// NEW    
let image = image::imageops::grayscale(&original_img);
{{< / highlight >}}

Accesing pixels:

{{< highlight rust >}}
// OLD
image.get_pixel(col, row).unwrap().r as i32;

// NEW
image[(col, row)].to_rgb()[0] as i32;
{{< / highlight >}}

Cropping (yeah, this one got so much worse):

{{< highlight rust >}}
// OLD

fn cut_into_a4(original_img: &Image, cut: i32) -> (Image, Image) {
    let (w,h) = original_img.dimensions();

    let mut left_page = imageops::crop(img, 0, 0, cut, h).to_image();
    let mut left_page = original_img.clone();
    editor::crop(&mut left_page, cut, h, 
        PositionMode::TopLeft, 0, 0).unwrap();
    img_to_a4(&mut left_page);

    let mut right_page = original_img.clone();
    editor::crop(&mut right_page, w - cut, h, 
        PositionMode::TopLeft, cut, 0).unwrap();
    img_to_a4(&mut right_page);

    (left_page, right_page)
}

// NEW
fn cut_into_a4<I: GenericImage + 'static>(img: &mut I, cut: u32) -> 
    (ImageBuffer<I::Pixel, Vec<<I::Pixel as Pixel>::Subpixel>>, 
    ImageBuffer<I::Pixel, Vec<<I::Pixel as Pixel>::Subpixel>>) 
    where I::Pixel: 'static,
            <I::Pixel as Pixel>::Subpixel: 'static {
    let (w,h) = img.dimensions();

    let left_page = image::imageops::crop(img, 0, 0, cut, h).to_image();
    //img_to_a4(&mut left_page);

    let right_page = image::imageops::crop(img, w - cut, 0, cut, h).to_image();
    //img_to_a4(&mut right_page);

    (left_page, right_page)
}
{{< / highlight >}}

Resizing as fit, filling background, probably the biggest change since there were no functions available to do this properly, unlike in raster:

{{< highlight rust >}}
// OLD
fn img_to_a4(img: &mut Image) {

    let mut background = raster::Image::blank(595, 842);
    editor::fill(&mut background, raster::Color::white()).unwrap();

    editor::resize(img, 595, 842, raster::ResizeMode::Fit).unwrap();
    *img = editor::blend(&background, &img, 
        raster::BlendMode::Normal, 1.0, PositionMode::Center, 0, 0)
        .unwrap();
}

// NEW
fn img_to_a4<I: GenericImage + 'static>(img: &I) -> 
    ImageBuffer<I::Pixel, Vec<<I::Pixel as Pixel>::Subpixel>> {
    // 300 dpi => 2475 x 3525
    // 144 dpi => 1190 x 1683
    // 72 dpi => 595 x 842
    let new_w = 595;
    let new_h = 842;
    let mut background = image::ImageBuffer::new(new_w, new_h);

    // Pixel may not be defined as RGBA, so we use the type of the
    // given
    let pix = img.get_pixel(0,0).map(|_| num_traits::NumCast::from(255).unwrap());
    for (_x, _y, pixel) in background.enumerate_pixels_mut() {
        *pixel = pix;
    }

    let (w,h) = img.dimensions();
    let x_ratio = new_w as f32 / img.width() as f32;
    let y_ratio = new_h as f32 / img.height() as f32;
    let usable_ratio = x_ratio.min(y_ratio);

    let tmp_w = (w as f32 * usable_ratio) as u32;
    let tmp_h = (h as f32 * usable_ratio) as u32;

    let resized = image::imageops::resize(img, tmp_w, tmp_h, image::FilterType::Lanczos3);

    // We don't want to put it on the top left, but on the center, so we
    // offset it a bit
    let offset_x = (new_w - tmp_w) / 2;
    let offset_y = (new_h - tmp_h) / 2;
    for (x, y, pixel) in resized.enumerate_pixels() {
        background.put_pixel(x + offset_x, y + offset_y, *pixel);
    }
    background
}

{{< / highlight >}}