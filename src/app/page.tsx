import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import bottles from "@/assets/images/bottles.jpg";
import { SESSION_COOKIE } from "@/lib/api";

export default async function HomePage() {
  if ((await cookies()).has(SESSION_COOKIE)) redirect("/designs");

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="grid content-center gap-6 px-4 py-16 sm:px-12 lg:px-16">
        <p className="text-sm font-medium tracking-widest text-gold">OLIVED STUDIO</p>
        <h1 className="text-5xl leading-tight">Your olive oil, your brand, ready for your market.</h1>
        <p className="max-w-lg text-mid">
          Choose a product, pick the country you sell in, and design packaging that follows that market&apos;s rules.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/register" className="btn">
            Create an account
          </Link>
          <Link href="/login" className="btn btn-outline">
            Log in
          </Link>
        </div>
      </div>

      <div className="relative aspect-[4/5] lg:aspect-auto">
        <Image
          src={bottles}
          alt="Four olive oil bottles from 250 ml to 1 litre, with the ORZETA label"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-bottom"
          placeholder="blur"
        />
      </div>
    </main>
  );
}
