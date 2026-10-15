import { createFileRoute } from "@tanstack/react-router";
import { TrainingTypePage } from "@/components/site/TrainingTypePage";

export const Route = createFileRoute("/training/tactical")({
  head: () => ({
    meta: [
      { title: "التدريب التكتيكي — IRON MIND FC" },
      { name: "description", content: "تمارين التمركز والضغط والتحولات وقراءة اللعب." },
      { property: "og:title", content: "التدريب التكتيكي — IRON MIND FC" },
      { property: "og:description", content: "تمارين التمركز والضغط والتحولات وقراءة اللعب." },
    ],
  }),
  component: () => <TrainingTypePage type="tactical" />,
});
