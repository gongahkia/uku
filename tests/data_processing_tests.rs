use uku::data_processing::{NormalizedContribution, aggregate_contributions, total_contributions, streaks};

#[test]
fn test_aggregate_and_total_contributions() {
    let github = vec![NormalizedContribution { platform: "GitHub".into(), date: "2024-01-01".into(), count: 2 }];
    let gitlab = vec![NormalizedContribution { platform: "GitLab".into(), date: "2024-01-01".into(), count: 3 }];
    let bitbucket = vec![NormalizedContribution { platform: "Bitbucket".into(), date: "2024-01-02".into(), count: 1 }];
    let all = [github.clone(), gitlab.clone(), bitbucket.clone()].concat();
    let total = total_contributions(&all);
    assert_eq!(total, 6);
}

#[test]
fn test_streaks_count() {
    let contribs = vec![
        NormalizedContribution { platform: "GitHub".into(), date: "2024-01-01".into(), count: 2 },
        NormalizedContribution { platform: "GitLab".into(), date: "2024-01-01".into(), count: 3 },
        NormalizedContribution { platform: "Bitbucket".into(), date: "2024-01-02".into(), count: 1 }
    ];
    let streak = streaks(&contribs);
    assert_eq!(streak, 2);
}
