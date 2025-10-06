import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import "./globals.css";

export default function Home() {
  return (
    <div>
      <Header/>
      <main>
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
