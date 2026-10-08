import Link from "next/link";

interface BackLinkProps {
  href: string;
  label: string;
}

// "← Back to …" link at the top of detail and form pages.
export default function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link href={href} className="back-link">
      <i className="pi pi-arrow-left" aria-hidden="true" />
      {label}
    </Link>
  );
}
