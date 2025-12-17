// Simple Bulgarian Cyrillic -> Latin transliteration + slugify helper
export function transliterateBulgarian(str = "") {
  const map = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p",
    р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch",
    ш: "sh", щ: "sht", ъ: "a", ь: "", ю: "yu", я: "ya",
    А: "A", Б: "B", В: "V", Г: "G", Д: "D", Е: "E", Ж: "Zh", З: "Z",
    И: "I", Й: "Y", К: "K", Л: "L", М: "M", Н: "N", О: "O", П: "P",
    Р: "R", С: "S", Т: "T", У: "U", Ф: "F", Х: "H", Ц: "Ts", Ч: "Ch",
    Ш: "Sh", Щ: "Sht", Ъ: "A", Ь: "", Ю: "Yu", Я: "Ya",
  };

  return String(str).split("").map(ch => map[ch] ?? ch).join("");
}

export function slugifyBulgarian(str = "") {
  const s = transliterateBulgarian(str)
    .toLowerCase()
    // replace non-alphanumeric with hyphen
    .replace(/[^a-z0-9]+/g, "-")
    // collapse multiple hyphens and trim
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return s || "file";
}

export default slugifyBulgarian;
