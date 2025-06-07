import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function QualityMetricsCard({ metrics }) {
  const quality_metrics = metrics || {
    grade_a: "0%",
    grade_b: "0%",
    grade_c: "0%"
  };

  const parsePercentage = (value) => {
    return parseInt(value.replace('%', '')) || 0;
  };

  const qualityBreakdown = [
    { grade: 'A', value: parsePercentage(quality_metrics.grade_a) },
    { grade: 'B', value: parsePercentage(quality_metrics.grade_b) },
    { grade: 'C', value: parsePercentage(quality_metrics.grade_c) }
  ];

  const overallQualityScore = quality_metrics.grade_a || '0%';

  const getProgressColor = (grade) => {
    switch(grade) {
      case 'A': return 'bg-green-100';
      case 'B': return 'bg-yellow-100';
      case 'C': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Milk Quality Grades</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Overall Quality Score</span>
            <span className="font-bold text-green-600">{overallQualityScore}</span>
          </div>
          <Progress 
            value={parsePercentage(overallQualityScore)} 
            className="bg-green-50"
          />
        </div>

        <div className="space-y-3">
          {qualityBreakdown.map(({ grade, value }) => (
            <div key={grade}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Grade {grade}</span>
                <span>{value}%</span>
              </div>
              <Progress 
                value={value} 
                className={getProgressColor(grade)}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>Grade A: Premium Quality</p>
          <p>Grade B: Standard Quality</p>
          <p>Grade C: Needs Improvement</p>
        </div>
      </CardContent>
    </Card>
  );
}