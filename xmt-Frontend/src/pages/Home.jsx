import LibrarySidebar from "@/components/Home/leftContent/LibrarySidebar";
import HomeContent from "@/components/Home/midContent/HomeContent";
import NowPlayingSidebar from "@/components/Home/rightContent/NowPlayingSidebar";
const Home = () => {
  return (
    <>
      <div className="flex gap-7 px-5 mt-5 h-full overflow-hidden ">
        <LibrarySidebar />
        <HomeContent />
        <NowPlayingSidebar />
      </div>
    </>
  );
};

export default Home;
