import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queryAndMutations";

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();

  // trigger Loader if currentUser is undefined. Allows to take some patience from user while fetching the currentUser data.
  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {currentUser.liked.length === 0 ? (
        <p className="h2-bold text-center">No liked posts</p>
      ) : (
        <GridPostList posts={currentUser.liked} showStats={false} />
      )}
    </>
  );
};

export default LikedPosts;
