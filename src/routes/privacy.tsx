import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/ContentPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية — IRON MIND FC" },
      { name: "description", content: "كيف نجمع بياناتك ونستخدمها ونحميها في IRON MIND FC." },
      { property: "og:title", content: "سياسة الخصوصية — IRON MIND FC" },
      { property: "og:description", content: "سياسة الخصوصية." },
    ],
  }),
  component: () => (
    <ContentPage slug="privacy" fallbackTitle="سياسة الخصوصية"
      fallback={"نجمع فقط البيانات اللازمة لتقديم الخدمة: البريد الإلكتروني، وبياناتك الكروية التي تدخلها، وسجل تقدمك.\n\nلا نشارك بياناتك مع أي طرف ثالث لأغراض تسويقية. يمكنك تعديل بياناتك في أي وقت من صفحة الملف الشخصي، أو التواصل معنا لطلب حذف حسابك."} />
  ),
});
