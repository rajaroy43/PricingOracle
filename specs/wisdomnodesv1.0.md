Lithium Finance INTERNAL DOCUMENT

Wisdom Nodes Operations v1.0
DRAFT


Wisdom Nodes are individuals (human) who have expertise in pricing, or want to try their hand at pricing assets within certain verticals. It is important to note that wisdom nodes are NOT investors or stakers in the traditional sense.  Their primary mode is to be paid and rewarded for answers to pricing questions. Broadly speaking Wisdom Nodes act as one actor who will engage with the protocol. If we characterize all 3 actors for direct comparison:

ACTORS:
1) Wisdom Seekers -- these are people seeking pricing information.  They are like traditional clients -- they will pay for services.

=> These actors must buy LITH in order to pay for the pricing service

2) Wisdom Nodes -- these are "alan the analyst" types who are seeking a way to earn from their knowledge.  Think of them as consultants that get paid for their answers.  These guys seek  to earn income from work and don't necessarily want to be bothered with buying LITH.  But as they get more advanced, perhaps they will want to stake more against their answers to earn more.

=> These actors don't necessarily need to buy LITH -- they seek to earn LITH by giving good honest answers to questions.

3) LITH Token investors -- these are the people who buy the token and want to earn more yield or enhance their equity appreciation via staking yield or farming.  

=> These actors are looking to buy and hold (hopefully!) and we want to incentivize them to hold longer.

Therefore the income for the Wisdom Nodes can be defined in terms of LITH tokens.  To define it in USD would require token price projections, which is a bigger question beyond this writeup and one that all of Lithium Finance should be seeking to maximize.  And because of this, to maximize your income, simply maximize your LITH!

LITH reward calculation starts with the basic DMI-Mechanism reward, and is enhanced by two components:  Staking and Reputation.




Basic Reward: DMI-Mechanism for Reward Calculation.

After a set of questions within one category is answered by a significant number of Wisdom Nodes (usually greater than 10), we can calculate the Reward payout function.  This is a reward score per Wisdom Node based on their set of answers to their questions.  

If the wisdom node provides truthful answers, they receive a normalized reward score (all scores sum to 1), based on the overall set of answers by the nodes for that set.  Typical responses are about 10% of the Nodes will receive a positive score, 80% of the nodes will receive a score of 0 and 10% of the nodes will receive a negative score.  

Basic Reward[i] = From DMI Mechanism, normalized so the sum of all rewards for this question set = 1.

Reputation for each wisdom node is calculated on a per-category basis, noted as j.  So a Wisdom Node A might have a reputation of: [0 0 0 5 2 0 0], meaning that for the first three categories and last two, they have no reputation.  For the 4th category the node has a strong reputation and the 5th category has a good reputation.  As they answer honestly and correctly, their reward and reputation are updated together.

The formula for updating the reputation is:

Reputation[i][j] = Reputation[i][j]  + Reward Payout[i][j] 

Where i is the node identifier and j is the category from which this answer set is assigned.

Staking for each wisdom node happens while they answer question sets.  If they have particular confidence in their answers, they can stake LITH tokens on the entire answer set to win a larger percentage of the total reward pool.  Of course, if they answer dishonestly, they will lose this stake and their reputation will be slashed.

Overall reward pool for this set of questions in category j is:  

Sum of all Wisdom Seeker bounties plus All staking amounts by Wisdom Nodes

For each set of questions in category j:

Reward payout [i] = 
  
Basic Reward[i] * (Reputation[i][j] + (Staked amount[i]) +1) 
------------------------------
 Overall reward Pool
