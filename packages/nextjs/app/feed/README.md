# Feed Page Structure

* [Header](header.tsx)
* Body
  * [LeftPage](leftPage.tsx): static
  * [ContentPage](contentPage.tsx)
    * [CreatePost](createPost.tsx): Implemented input function, but haven't connect the input with a contract.
    * PostList: static.
  * [RightPage](rightPage.tsx): static


# Create a Post

In `createPost.tsx` file, listen for changes to `clickPost`.

If `clickPost` is true, it indicates that the user has click the post button. And we could interact with a contract to actually create a post. 

> `title`: post title
>
> `content`: post content
