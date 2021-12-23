export interface Post {
  id: string,
  title: string,
  content: string,
  creator: string,
  imagePath: File | string,
}

export interface PostBE {
  _id: string,
  title: string,
  content: string,
  creator: string,
  imagePath: File | string,
}

export function convertPostFromBackend(postBE: PostBE) {
  return {
    title: postBE.title,
    content: postBE.content,
    id: postBE._id,
    creator: postBE.creator,
    imagePath: postBE.imagePath
  } as Post;
}
