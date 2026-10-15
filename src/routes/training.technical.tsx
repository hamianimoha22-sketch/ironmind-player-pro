import { createFileRoute } from "@tanstack/react-router";
import { TrainingTypePage } from "@/components/site/TrainingTypePage";

export const Route = createFileRoute("/training/technical")({
  head: () => ({
    meta: [
      { title: "التدريب الفني — IRON MIND FC" },
      { name: "description", content: "تمارين التحكم بالكرة والمراوغة والتمرير والتسديد والإنهاء." },
      { property: "og:title", content: "التدريب الفني — IRON MIND FC" },
      { property: "og:description", content: "تمارين التحكم بالكرة والمراوغة والتمرير والتسديد والإنهاء." },
    ],
  }),
  component: () => <TrainingTypePage type="technical" />,
});
