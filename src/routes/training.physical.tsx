import { createFileRoute } from "@tanstack/react-router";
import { TrainingTypePage } from "@/components/site/TrainingTypePage";

export const Route = createFileRoute("/training/physical")({
  head: () => ({
    meta: [
      { title: "التدريب البدني — IRON MIND FC" },
      { name: "description", content: "تمارين السرعة والقوة الانفجارية والرشاقة والتحمل والوقاية من الإصابات." },
      { property: "og:title", content: "التدريب البدني — IRON MIND FC" },
      { property: "og:description", content: "تمارين السرعة والقوة الانفجارية والرشاقة والتحمل والوقاية من الإصابات." },
    ],
  }),
  component: () => <TrainingTypePage type="physical" />,
});
