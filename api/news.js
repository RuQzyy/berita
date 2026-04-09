export default async function handler(req, res) {
  const response = await fetch(
    "https://berita-indo-api-next.vercel.app/api/cnn-news"
  );

  const data = await response.json();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(data);
}
