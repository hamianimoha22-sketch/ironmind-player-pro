import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/ContentPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "حول IRON MIND FC" },
      { name: "description", content: "تعرّف على IRON MIND FC ومنهجه في تطوير لاعبي كرة القدم." },
      { property: "og:title", content: "حول IRON MIND FC" },
      { property: "og:description", content: "منهج متكامل لتطوير لاعبي كرة القدم." },
    ],
  }),
  component: () => (
    <ContentPage slug="about" fallbackTitle="حول IRON MIND FC"
      fallback={"IRON MIND FC منصة عربية متخصصة في تطوير لاعبي كرة القدم فنيًا وبدنيًا وتكتيكيًا وذهنيًا.\n\nيختار اللاعب مركزه ومستواه، ويحصل على البرامج التدريبية التي أعدّها فريقنا خصيصًا لذلك المركز، مع جدول أسبوعي واضح ومتابعة للتقدم."} />
  ),
});
