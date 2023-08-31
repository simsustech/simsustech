import Knex from "knex";
import { Model } from "objection";
// @ts-ignore
import knexConfig from "../knexfile.js";
import inquirer from "inquirer";
import { Book } from "./models/Book.js";
// @ts-ignore
export const knex = Knex(knexConfig);
Model.knex(knex);

const questions = [
  {
    type: "input",
    name: "searchTerms",
    message: "Search terms:",
  },
];
const prompt = async () => {
  const answers = await inquirer.prompt(questions);
  const result = await Book.search(answers.searchTerms);
  console.log("Result:\n");
  console.log(result);
  prompt();
};

prompt();
