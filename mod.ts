export const buildApiUrl = (i: number) => {
  const apiUrl = new URL("/api/v2/snapshot/video/contents/search", "https://api.search.nicovideo.jp");
  apiUrl.searchParams.set("q", "");
  apiUrl.searchParams.set("targets", "title");
  apiUrl.searchParams.set("fields", "contentId,title,viewCounter,tags");
  apiUrl.searchParams.set("filters[tagsExact][0]", "音MAD");
  apiUrl.searchParams.set("_sort", "-startTime");
  apiUrl.searchParams.set("_limit", `${100}`);
  apiUrl.searchParams.set("_offset", `${i * 100}`);
  return apiUrl.toString();
};

const allVideos = [], allTags = [];

for (let i = 0; i < 20; i++) {
  const apiUrl = buildApiUrl(i);
  const result = await fetch(apiUrl.toString());
  const json = await result.json();

  const videos: { contentId: string; title: string; viewCounter: number; tags: string[] }[] = json.data.map((
    { contentId, title, viewCounter, tags }: { contentId: string; title: string; viewCounter: number; tags: string },
  ) => ({ contentId, title, viewCounter, tags: tags.split(" ") }));
  const tags = videos.reduce((p, c) => [...p, ...c.tags], [] as string[]);

  allVideos.push(...videos);
  allTags.push(...tags);
}

await Deno.writeTextFile("./tags.txt", [...new Set(allTags)].sort().join("\n"));
