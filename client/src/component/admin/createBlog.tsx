export default function CreateBlog() {
  return (
    <section className="font-plex max-w-4xl">
      <h1 className="text-white text-5xl font-bold mb-8">New Post</h1>

      <h1 className="font-plex text-accent text-xl font-bold mb-3">
        Blog Title
      </h1>
      <input
        className="px-4 py-2 bg-white/20 border rounded-md text-white w-full border-accent focus:border-accent-secondary outline-none"
        placeholder="Write the title here..."
        type="text"
      />

      <h1 className="mt-5 font-plex text-accent text-xl font-bold mb-3">
        Content
      </h1>
      <input
        className="px-4 h-screen bg-white/20 border rounded-md text-white w-full border-accent focus:border-accent-secondary outline-none"
        placeholder="Write ur content here fellas"
        type="text"
      />

      <h1 className="mt-10 font-plex text-accent text-xl font-bold mb-3">
        Upload Thumbnail
      </h1>
      <div className="flex flex-row w-1/4">
        <button className="py-1 w-full mr-2 bg-accent-secondary text-center rounded-md text-white font-semibold hover:bg-accent cursor-pointer hover:text-bg">
          Upload
        </button>
        <button className="py-1 w-full bg-gray text-center rounded-md text-primary font-semibold cursor-pointer hover:bg-bg-dark hover:text-accent">
          Delete
        </button>
      </div>

      <button className="mt-20 w-full text-center bg-accent py-2 rounded-md text-bg cursor-pointer hover:bg-accent-secondary font-bold hover:text-white mb-10 ">Publish</button>
    </section>
  );
}
