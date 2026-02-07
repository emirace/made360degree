import { getAllContacts } from "@/services/contact";
import ContactListClient from "@/components/dashboard/contact-list-client";

export default async function ContactPage() {
  const contacts = await getAllContacts();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white font-outfit">
          Contact Submissions
        </h2>
        <p className="text-zinc-400 mt-2">
          View and respond to messages from your website visitors.
        </p>
      </div>

      <ContactListClient initialContacts={contacts} />
    </div>
  );
}
