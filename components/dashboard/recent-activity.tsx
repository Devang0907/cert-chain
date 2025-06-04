"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock activity data
const activities = [
  {
    id: "act-1",
    type: "view",
    certificate: "Bachelor of Computer Science",
    viewer: "TechCorp Inc.",
    date: "2024-05-20T15:30:00",
  },
  {
    id: "act-2",
    type: "issue",
    certificate: "Introduction to Blockchain",
    issuer: "MIT",
    date: "2024-03-22T09:15:00",
  },
  {
    id: "act-3",
    type: "share",
    certificate: "Web Development Bootcamp",
    sharedWith: "Global Recruiters",
    date: "2024-02-18T14:45:00",
  },
  {
    id: "act-4",
    type: "view",
    certificate: "Bachelor of Computer Science",
    viewer: "InnoTech Solutions",
    date: "2024-02-10T11:20:00",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Recent actions on your certificates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex">
              <div className="mr-4 flex items-center justify-center">
                <div className="relative h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  {activity.type === "view" && (
                    <svg xmlns="http://www.w3.org/2000/svg\" width="20\" height="20\" viewBox="0 0 24 24\" fill="none\" stroke="currentColor\" strokeWidth="2\" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12\" cy="12\" r="3"/></svg>
                  )}
                  {activity.type === "issue" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z"/><polyline points="8 10 12 14 16 10"/></svg>
                  )}
                  {activity.type === "share" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  )}
                </div>
                <div className="absolute h-24 w-px bg-muted-foreground/10"></div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {activity.type === "view" && "Viewed"}
                    {activity.type === "issue" && "Issued"}
                    {activity.type === "share" && "Shared"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.date).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm font-medium">
                  {activity.certificate}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.type === "view" && `Viewed by ${activity.viewer}`}
                  {activity.type === "issue" && `Issued by ${activity.issuer}`}
                  {activity.type === "share" && `Shared with ${activity.sharedWith}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}