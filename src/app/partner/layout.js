import ChatWidgetEmbed from "@/components/ChatWidgetEmbed";

export default function PartnerLayout({ children }) {
  return (
    <>
      {children}
      <ChatWidgetEmbed />
    </>
  );
}
