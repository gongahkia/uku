use std::fs;
use std::io::{self, Write};

pub fn read_file(path: &str) -> Result<String, io::Error> {
    fs::read_to_string(path)
}

pub fn write_file(path: &str, contents: &str) -> Result<(), io::Error> {
    let mut file = fs::File::create(path)?;
    file.write_all(contents.as_bytes())
}

pub fn print_error(msg: &str) {
    eprintln!("Error: {}", msg);
}

pub fn print_success(msg: &str) {
    println!("Success: {}", msg);
}
