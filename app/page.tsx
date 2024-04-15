
import { getSession } from "@/actions/auth";
import LandingPage from "@/components/landingPage";
import { Toaster } from "@/components/ui/sonner";
import { redirect } from "next/navigation";



export default async function Home() {
  const session = await getSession();
  console.log(session)
  
  if(session){
   redirect('/home');
  }

  return (
    <>
      <LandingPage />
    </>
  );
}


