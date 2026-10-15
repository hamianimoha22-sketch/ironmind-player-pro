import { createFileRoute } from "@tanstack/react-router";
import { TrainingTypePage } from "@/components/site/TrainingTypePage";

export const Route = createFileRoute("/training/mental")({
  head: () => ({
    meta: [
      { title: "العقلية الكروية — IRON MIND FC" },
      { name: "description", content: "تمارين التركيز والثقة والانضباط والاستعداد الذهني." },
      { property: "og:title", content: "العقلية الكروية — IRON MIND FC" },
      { property: "og:description", content: "تمارين التركيز والثقة والانضباط والاستعداد الذهني." },
    ],
  }),
  component: () => <TrainingTypePage type="mental" />,
});
