import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/ContentPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "شروط الاستخدام — IRON MIND FC" },
      { name: "description", content: "الشروط والأحكام الخاصة باستخدام منصة IRON MIND FC." },
      { property: "og:title", content: "شروط الاستخدام — IRON MIND FC" },
      { property: "og:description", content: "شروط الاستخدام." },
    ],
  }),
  component: () => (
    <ContentPage slug="terms" fallbackTitle="شروط الاستخدام"
      fallback={"باستخدامك للموقع فإنك توافق على استخدام المحتوى التدريبي لأغراض شخصية فقط.\n\nالتدريبات البدنية تحمل نسبة من المخاطر؛ استشر مختصًا قبل البدء إذا كانت لديك أي حالة صحية، والتزم بملاحظات السلامة المرفقة بكل تدريب."} />
  ),
});
