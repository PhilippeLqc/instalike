import React, { useState, useEffect } from "react";
import {
  useDeleteSavedPost,
  useGetComments,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queryAndMutations";
import { Models } from "appwrite";
import { checkIsLiked } from "@/lib/utils";
import Loader from "./Loader";
import { Link } from "react-router-dom";

type PostStatsProps = {
  post?: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const LikeList = post?.likes.map((user: Models.Document) => user.$id);

  const [likes, setlikes] = useState<string[]>(LikeList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } =
    useDeleteSavedPost();

  const { data: comments } = useGetComments(post?.$id || "");
  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post?.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser, savedPostRecord]);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    let NewLikes = [...likes];
    const hasLiked = NewLikes.includes(userId);

    if (hasLiked) {
      NewLikes = NewLikes.filter((id) => id !== userId);
    } else {
      NewLikes.push(userId);
    }

    setlikes(NewLikes);
    likePost({ postId: post?.$id || "", likesArray: NewLikes });
  };

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savedPostRecord) {
      deleteSavedPost(savedPostRecord.$id);
      setIsSaved(false);
    } else {
      savePost({ post: post?.$id || "", user: userId });
      setIsSaved(true);
    }
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
        <Link to={`/posts/${post?.$id}`}>
          <img
            src="/assets/icons/comment.svg"
            alt="comment"
            width={20}
            height={20}
            className="cursor-pointer"
          />
        </Link>
        <p className="small-medium lg:base-medium">
          {comments?.documents.length}
        </p>
      </div>
      <div className="flex gap-2">
        {isSavingPost || isDeletingSaved ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="like"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
