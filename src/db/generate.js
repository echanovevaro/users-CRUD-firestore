import { faker } from "@faker-js/faker"
import fs from "fs"

const generatePersonsData = (number) => {
  const persons = []
  while (number >= 0) {
    persons.push({
      id: number,
      avatar: faker.image.avatarGitHub(),
      catchPhrase: faker.company.catchPhrase(2),
      email: faker.internet.email(),
      urlLoremFlickr: faker.image.imageUrl(800, 600, "city", true),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      productDescription: faker.commerce.productDescription(),
      company: faker.company.name(),
      catchPhraseNoun: faker.company.catchPhraseNoun(),
      imageNature: faker.image.nature(),
    })
    number--
  }

  return persons
}
fs.writeFileSync(
  "./db.json",
  JSON.stringify({ users: generatePersonsData(23) })
)
