use uku::data_processing::NormalizedContribution;
use uku::visualization::{print_ascii_bar_chart, print_platform_summary, print_heatmap};

#[test]
fn test_print_ascii_bar_chart() {
    let contribs = vec![
        NormalizedContribution { platform: "GitHub".into(), date: "2024-01-01".into(), count: 2 },
        NormalizedContribution { platform: "GitLab".into(), date: "2024-01-02".into(), count: 3 }
    ];
    print_ascii_bar_chart(&contribs);
}

#[test]
fn test_print_platform_summary() {
    let contribs = vec![
        NormalizedContribution { platform: "GitHub".into(), date: "2024-01-01".into(), count: 2 },
        NormalizedContribution { platform: "GitLab".into(), date: "2024-01-02".into(), count: 3 }
    ];
    print_platform_summary(&contribs);
}

#[test]
fn test_print_heatmap() {
    let contribs = vec![
        NormalizedContribution { platform: "GitHub".into(), date: "2024-01-01".into(), count: 2 },
        NormalizedContribution { platform: "GitLab".into(), date: "2024-01-02".into(), count: 3 }
    ];
    print_heatmap(&contribs);
}
