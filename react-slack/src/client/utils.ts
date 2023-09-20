export async function defineWord(word: string | undefined | null) {
  try {
    const response = await global.fetch(
      "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
    );
    const json = await response.json();
    return json[0].meanings[0].definitions[0].definition;
  } catch (error) {
    return "Could not find a definition. Try another word or try again later.";
  }
}
