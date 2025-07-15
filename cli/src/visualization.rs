use crate::data_processing::NormalizedContribution;
use std::collections::BTreeMap;

pub fn print_ascii_bar_chart(contribs: &[NormalizedContribution]) {
    let mut map = BTreeMap::new();
    for c in contribs {
        *map.entry(&c.date).or_insert(0) += c.count;
    }
    for (date, count) in map.iter() {
        let bar = std::iter::repeat("█").take(*count as usize).collect::<String>();
        println!("{:<12} | {}", date, bar);
    }
}

pub fn print_platform_summary(contribs: &[NormalizedContribution]) {
    let mut sums = BTreeMap::new();
    for c in contribs {
        *sums.entry(&c.platform).or_insert(0) += c.count;
    }
    println!("Platform Contribution Summary:");
    for (platform, count) in sums.iter() {
        println!("  {:<10}: {}", platform, count);
    }
}

pub fn print_heatmap(contribs: &[NormalizedContribution]) {
    use chrono::NaiveDate;
    let mut day_counts = BTreeMap::new();
    for c in contribs {
        let date = NaiveDate::parse_from_str(&c.date, "%Y-%m-%d").unwrap_or_else(|_| NaiveDate::from_ymd_opt(1970, 1, 1).unwrap());
        *day_counts.entry(date).or_insert(0) += c.count;
    }
    let mut days: Vec<_> = day_counts.keys().cloned().collect();
    days.sort();
    println!("Contribution Heatmap:");
    for date in days {
        let count = day_counts.get(&date).cloned().unwrap_or(0);
        let symbol = match count {
            0 => " ",
            1..=2 => "░",
            3..=5 => "▒",
            6..=10 => "▓",
            _ => "█",
        };
        print!("{}", symbol);
        if date.weekday().number_from_monday() == 7 {
            println!();
        }
    }
    println!();
}
