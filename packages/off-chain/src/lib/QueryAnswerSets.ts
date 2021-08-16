import { createClient } from 'urql';
const APIURL = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";
//require when passing with createClient with url
import "isomorphic-fetch"

var currentDate = (new Date()) as unknown as number;
//convert miliseconds to seconds
const currentTime=Math.round(currentDate/1000);
const questionSetsquery=`
query questions {
    questions (where:{endTime_gt:${currentTime}}){
      id
      answers{
        answerIndex
      }
      }
  }`




const client = createClient({
  url: APIURL
});

async function QueryAnswerSets(): Promise<Map<number, any>>{
  try {
    const resp = await client.query(questionSetsquery).toPromise();
    if (resp.error)
      throw new Error(`can't get data from subraph ${resp.error}`);
    const getData = resp.data["questions"];

    let mp: Map<number, any> = new Map();
    getData.map((result_1: { answers: any; id: number; }) => {
      mp.set(result_1.id, result_1.answers);
    });
    return mp;
  } catch (err) {
    console.log(err)
    return new Map(null);
  }
}
QueryAnswerSets()
export default QueryAnswerSets