pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./Roles.sol";
import "./interfaces/ILithiumPricing.sol";
import "./interfaces/ILithiumReward.sol";

/**
 * @title LithiumPricing
 */
contract LithiumPricing is ILithiumPricing, Initializable, Roles {
    struct Question {
        address owner; // question creator
        uint256 id; // uinique identifier
        uint256 categoryId; // related category id
        bytes32 description; // explanation of asset to price ex 'The price of LITH will be higher then' in bytes
        uint256[] answerSet; // the list of possible answers
        uint256[] answerSetTotalStaked; // the total staked for each answer
        uint256 bounty; // to bounty offered by the questions creator in LITH tokens
        uint256 totalStaked; // the sum of AnswerSetTotals in LITH token
        uint256 endTime; // the time answering ends relative to block.timestamp
        uint256 pricingTime; //Indicate when the asset should be priced for
        uint256 startTime; //startTime for answering question
        uint256[] answerHashIdxs; //Encrypted answer in form of multihash
        StatusCalculated isAnswerCalculated; //answer calculated status will be Updated by LithiumCordinator once deadline passed
        QuestionType questionType; //Type of a question can be one of two (Pricing  or  GroundTruth )
    }

    struct QuestionGroup {
        uint256 id;
        uint256[] questionIds;
        uint16 minimumRequiredAnswer;
    }

    struct Answer {
        address answerer; // the answer creator
        uint256 questionId; // the id of the question being answered
        uint256 stakeAmount; // the amount to stake in LITH token for the answer
        uint16 answerIndex; // the index of the chosen answer in the question.answerSet
        AnswerStatus status; // the status of the Answer, Unclaimed or Claimed
    }
    struct AnswerGroup {
        address answerer; // the answer creator
        uint256 questionGroupId; // the id of the questions being answered
        uint256[] stakeAmounts; // the amount to stake in LITH token for the answersSetsGroup
        uint16[] answerIndexes; // the index of the chosen answer in the question.answerSet
        uint256 rewardAmount; //reward rate can be negative,zero or positive
        AnswerStatus status; // the status of the AnswerSets, Unclaimed or Claimed
        StatusCalculated isRewardCalculated; //rewardcalculated status for answergroup
    }

    IERC20 LithiumToken;
    ILithiumReward lithiumReward;

    uint8 minAnswerSetLength;
    uint8 maxAnswerSetLength;

    bytes32[] public categories;

    Question[] questions;
    QuestionGroup[] public questionGroups;
    Multihash[] public answerHashes;

    uint16[] public revealTiers;

    struct QuestionBid {
        uint256 bidAmount;
        bool isBidRefunded;
    }

    //questionId -> nodeAddress -> QuestionBid
    mapping(uint256 => mapping(address => QuestionBid)) public questionBids;

    address public constant NULL_ADDRESS = address(0);

    // questionId => answerer => Answer
    mapping(uint256 => mapping(address => Answer)) public answers;

    // questionGroupId =>  answerer => AnswerGroup
    mapping(uint256 => mapping(address => AnswerGroup)) public answerGroups;

    mapping(address => mapping(uint256 => uint256)) userReputationScores;

    // minimumStake put by wisdom nodes when answering question
    uint256 public minimumStake;

    function initialize() public override initializer {
        Roles.initialize();
        _addCategory("preIPO");
        minAnswerSetLength = 2;
        maxAnswerSetLength = 2;
        uint16[] memory tiers = new uint16[](2);
        tiers[0] = 5;
        tiers[1] = 50;
        _updateRevealTiers(tiers);
    }

    /**
     * @dev Checks if an answer set is valid
     *
     * A valid answer set must have at least one value greater than zero and
     * must be in ascending order
     * `operatorData`. See {IERC777Sender} and {IERC777Recipient}.
     *
     * Emits a {Sent} event.
     *
     * Requirements
     *
     * - the caller must have at least `amount` tokens.
     * - `recipient` cannot be the zero address.
     * - if `recipient` is a contract, it must implement the {IERC777Recipient}
     * interface.
     */
    function isValidAnswerSet(uint256[] memory answerSet) internal view {
        require(
            minAnswerSetLength <= answerSet.length &&
                answerSet.length <= maxAnswerSetLength,
            "Answer Set length invalid"
        );
        require(answerSet[0] == 0, "AnswerSet must include 0");
        for (uint256 i = 1; i < answerSet.length; i++) {
            require(answerSet[i] > answerSet[i - 1], "Answers not ascending");
        }
    }

    // Get question data
    function getQuestion(uint256 _id) external view returns (Question memory) {
        Question storage question = questions[_id];
        return question;
    }

    //Get questionIds from questionGroups

    function getQuestionIds(uint256 questiongroupId)
        external
        view
        returns (uint256[] memory)
    {
        return questionGroups[questiongroupId].questionIds;
    }

    //Get all data for question and about the answer  with questionId _id and answr submitter as _answerer
    function getAnswer(uint256 _questionId, address _answerer)
        external
        view
        override
        returns (
            address answerer,
            uint256 questionId,
            uint16 answerIndex,
            uint256 stakeAmount,
            AnswerStatus status
        )
    {
        Answer storage answer = answers[_questionId][_answerer];
        answerer = answer.answerer;
        questionId = answer.questionId;
        answerIndex = answer.answerIndex;
        stakeAmount = answer.stakeAmount;
        status = answer.status;
    }

    //Get all data for question and about the answer  with questionId _id and answr submitter as _answerer
    function getAnswerGroup(uint256 _groupId, address _answerer)
        external
        view
        override
        returns (
            address answerer,
            uint256 questionGroupId,
            uint16[] memory answerIndexes,
            uint256 stakeAmount,
            AnswerStatus status,
            uint256 rewardAmount,
            StatusCalculated isRewardCalculated
        )
    {
        AnswerGroup storage answerGroup = answerGroups[_groupId][_answerer];
        for (uint256 i = 0; i < answerGroup.stakeAmounts.length; i++) {
            stakeAmount += answerGroup.stakeAmounts[i];
        }
        answerer = answerGroup.answerer;
        questionGroupId = answerGroup.questionGroupId;
        answerIndexes = answerGroup.answerIndexes;
        status = answerGroup.status;
        rewardAmount = answerGroup.rewardAmount;
        isRewardCalculated = answerGroup.isRewardCalculated;
    }

    //get staked amount for Question with id _questionId
    //Remember it will exclude the bounty that were offer by wisdom node
    function getAnswerSetTotals(uint256 questionId)
        external
        view
        override
        returns (uint256[] memory)
    {
        return questions[questionId].answerSetTotalStaked;
    }

    //Get all possible answer for a question with id _questionId

    function getAnswerSet(uint256 questionId)
        external
        view
        override
        returns (uint256[] memory)
    {
        return questions[questionId].answerSet;
    }

    //get total staked amount for Question group
    //remember it include totalStakedLithToken +Bounty for question group

    function getRewardTotal(uint256 groupId)
        external
        view
        override
        returns (uint256)
    {
        uint256[] memory questionIds = questionGroups[groupId].questionIds;
        uint256 totalRewardPerGroup;
        for (uint256 i = 0; i < questionIds.length; i++) {
            Question storage question = questions[i];
            totalRewardPerGroup += question.bounty + question.totalStaked;
        }

        return totalRewardPerGroup;
    }

    //get reputation of a user  with user address user category id  categoryId

    function getRepuation(address user, uint256 categoryId)
        public
        view
        returns (uint256)
    {
        return userReputationScores[user][categoryId];
    }

    function getRevealTiers() external view override returns (uint16[] memory) {
        return revealTiers;
    }

    /**
     * @dev Adds new category
     *
     */
    function _addCategory(string memory _label) internal {
        bytes32 hash = keccak256(abi.encodePacked(_label));
        categories.push(hash);
        emit CategoryAdded(categories.length - 1, _label);
    }

    /**
     * @dev Adds a Question to contract storage.
     * the `categoryId` is the id for the related category
     * the `bounty` is amount of tokens the questioner is offering for pricing information
     * the `description` is a description of the asset to price, ex 'The price of LITH token will be higher then'
     * the `endtime` is when all voting stops and votes are tallied and payouts become eligible relative to the block.timestamp
     * the `answerSet` is an array of values that represent equal to or greater than prices in usd
     *   Each answer except for the last represents the statement 'equal to or greather than the selected value and less than the next value in the array'
     *   with the last value representing the statement 'equal to or greater than the selected value'
     *   For example, an answerSet for the questions 'Will the price of the dow be greater or less than $35,000'
     *   would be [0,35000]
     *   An answerSet for the question 'Will the price of the dow be less then $35,000, between $35,000 and $37,000, or greater than $37,000'
     *   would be [0,35000,37000]
     *
     * Emits a { QuestionCreated } event.
     *
     * Requirements
     *
     * - the caller must have at least `bounty` tokens.
     * - the answer set must be valid (see isValidAnswerSet).
     * - the `endtime` must be in the future
     * - the category id must be valid
     */
    function _createQuestion(
        uint16 categoryId,
        uint256 bounty,
        uint256 pricingTime,
        uint256 endTime,
        QuestionType questionType,
        string memory description,
        uint256[] memory answerSet,
        uint256 startTime
    ) internal {
        require(endTime > block.timestamp, "Endtime invalid");
        require(
            startTime >= block.timestamp && startTime <= endTime,
            "startTime > end time or < current time"
        );
        require(
            pricingTime > endTime,
            "Pricing time of asset must be greater than endtime"
        );
        require(
            LithiumToken.balanceOf(msg.sender) >= bounty,
            "Insufficient balance"
        );
        require(categories[categoryId] != 0, "Invalid categoryId");
        isValidAnswerSet(answerSet);

        LithiumToken.transferFrom(msg.sender, address(this), bounty);
        uint256 id = questions.length;
        uint256[] memory answerSetTotalStaked = new uint256[](answerSet.length);
        Question memory question;
        question.id = id;
        question.categoryId = categoryId;
        question.bounty = bounty;
        question.owner = msg.sender;
        question.description = keccak256(abi.encodePacked(description));
        question.answerSet = answerSet;
        question.answerSetTotalStaked = answerSetTotalStaked;
        question.endTime = endTime;
        question.pricingTime = pricingTime;
        question.questionType = questionType;
        question.startTime = startTime;
        questions.push(question);

        questionBids[id][msg.sender] = QuestionBid(bounty, false);

        emit QuestionCreated(
            id,
            bounty,
            pricingTime,
            endTime,
            categoryId,
            question.owner,
            description,
            answerSet,
            questionType,
            startTime
        );
    }

    /**
     * @dev Adds an Answer to contract storage.
     * the `questionId` is the id of the question being answered
     * the `stakeAmount` is the amount of LITH the answerer wants to stake on the answer
     * and it will be added to totalStake for the question
     * and the answerSetTotal for the `answerIndex`
     * the `answerIndex` is the index of the answer in the question.answerSet
     *
     * Emits a { QuestionAnswered } event.
     *
     * Requirements
     *
     * - the caller must have at least `stakeAmount` tokens.
     * - `stakeAmount` must be greater than zero.
     * - the answerIndex must correspond to a valid answer(see isValidAnswerSet).
     * - the `endtime` must be in the future
     */
    function answerQuestion(
        uint256 _questionId,
        uint256 _stakeAmount,
        uint16 _answerIndex
    ) internal {
        require(_questionId < questions.length, "Invalid question id");
        Question storage question = questions[_questionId];
        require(
            question.startTime <= block.timestamp,
            "Answering question not started"
        );
        require(question.endTime > block.timestamp, "Question not active");
        require(
            _answerIndex <= question.answerSet.length,
            "Invalid answer index"
        );
        require(_stakeAmount >= minimumStake, "Stake amount < minimumStake");
        require(
            LithiumToken.balanceOf(msg.sender) >= _stakeAmount,
            "Insufficient balance"
        );
        require(
            answers[_questionId][msg.sender].answerer == address(0),
            "User already answered"
        );
        LithiumToken.transferFrom(msg.sender, address(this), _stakeAmount);
        Answer memory answer;
        answer.answerer = msg.sender;
        answer.questionId = _questionId;
        answer.answerIndex = _answerIndex;
        answer.stakeAmount = _stakeAmount;
        answers[_questionId][msg.sender] = answer;
        question.totalStaked = question.totalStaked + _stakeAmount;
        question.answerSetTotalStaked[_answerIndex] =
            question.answerSetTotalStaked[_answerIndex] +
            _stakeAmount;
        emit QuestionAnswered(
            _questionId,
            msg.sender,
            _stakeAmount,
            _answerIndex
        );
    }

    /**
     * @dev Allow users to claim a reward for an questionGroup id
     * the `_questionGroupId` is the id of the questionGroup to claim the reward .
     * The reward amount is determined by the LithiumReward contract
     * Emits a { RewardClaimed } event.
     */

    function _claimReward(uint256 _questionGroupId)
        internal
        returns (uint256 reward)
    {
        require(
            _questionGroupId < questionGroups.length,
            "Invalid question group id"
        );
        AnswerGroup storage answerGroup = answerGroups[_questionGroupId][
            msg.sender
        ];
        require(
            answerGroup.status == AnswerStatus.Unclaimed,
            "Group Rewards have already been claimed"
        );
        require(
            answerGroup.isRewardCalculated == StatusCalculated.Calculated,
            "Reward not calculated yet"
        );
        reward = lithiumReward.getReward(_questionGroupId, msg.sender);
        if (reward > 0) {
            LithiumToken.transfer(msg.sender, reward);
        }
        answerGroup.status = AnswerStatus.Claimed;
        emit RewardClaimed(_questionGroupId, msg.sender, reward);
    }

    function _increaseBid(uint256 questionId, uint256 lithBidAmount) internal {
        require(questionId < questions.length, "Invalid question id");
        require(lithBidAmount > 0, "Bidding amount is 0");
        Question storage question = questions[questionId];
        require(
            question.startTime > block.timestamp,
            "Answering question time started "
        );
        question.bounty = question.bounty + lithBidAmount;
        QuestionBid storage questionBid = questionBids[questionId][msg.sender];
        questionBid.bidAmount = questionBid.bidAmount + lithBidAmount;
        emit BidReceived(questionId, msg.sender, lithBidAmount);
    }

    function _updateRevealTiers(uint16[] memory _revealTiers) internal {
        revealTiers = _revealTiers;
        emit RevealTiersUpdated(revealTiers);
    }

    /**
     * @dev public interface to add a new category
     *
     * Requirements
     *
     * - the caller must be an admin.
     */
    function addCategory(string memory _label) public {
        require(isAdmin(msg.sender), "Must be admin");
        require(bytes(_label).length != 0, "Category label can't be null");
        _addCategory(_label);
    }

    /**
     * @dev Sets the address of the LithiumToken.
     *
     * Requirements
     *
     * - the caller must be an admin.
     */
    function setLithiumTokenAddress(address _tokenAddress) public {
        require(isAdmin(msg.sender), "Must be admin");
        require(_tokenAddress != NULL_ADDRESS, "Token Address != null");
        LithiumToken = IERC20(_tokenAddress);
        emit SetLithiumTokenAddress(address(LithiumToken));
    }

    /**
     * @dev Sets the address of the LithiumReward.
     *
     */
    function setLithiumRewardAddress(address _rewardAddress) public {
        require(isAdmin(msg.sender), "Must be admin");
        require(_rewardAddress != NULL_ADDRESS, "Reward Address != null");
        lithiumReward = ILithiumReward(_rewardAddress);
        emit SetLithiumRewardAddress(address(lithiumReward));
    }

    /**
     * @dev Allow Lithium Coordinator to update valid question with an answer
     * the `questionIds` is the  array of question id
     * the `answerHashes` is the array  for answerHash of questionIds
     * Requirements
     *
     * - the caller must be admin of this contract
     * - endtime must be passed for all  question
     * - the length of the array arguments must be equal
     * - rewards can't be updated again with same question id
     * - question id must be valid
     */
    function updateValidAnswerStatus(
        uint256[] memory _questionIds,
        Multihash[] memory _answerHashes
    ) external override {
        require(isAdmin(msg.sender), "Must be admin");
        require(_questionIds.length != 0, "questionIds empty");
        require(
            _questionIds.length == _answerHashes.length,
            "argument length mismatch"
        );
        for (uint256 i = 0; i < _questionIds.length; i++) {
            uint256 questionId = _questionIds[i];
            require(questionId < questions.length, "Invalid question id");
            Question storage question = questions[questionId];
            require(question.endTime <= block.timestamp, "Question is active");
            require(
                question.isAnswerCalculated == StatusCalculated.NotCalculated,
                "Answer is calculated"
            );
            uint256 hashIdx = answerHashes.length;
            question.answerHashIdxs.push(hashIdx);
            Multihash memory multihash;
            multihash.digest = _answerHashes[i].digest;
            multihash.hashFunction = _answerHashes[i].hashFunction;
            multihash.size = _answerHashes[i].size;
            answerHashes.push(multihash);
            question.isAnswerCalculated = StatusCalculated.Calculated;
            emit FinalAnswerCalculatedStatus(
                questionId,
                multihash.digest,
                multihash.hashFunction,
                multihash.size,
                question.isAnswerCalculated
            );
        }
    }

    /**
     * @dev Allow Lithium Coordinator to update invalid questions
     * the `questionIds` is the  array of question id
     * Requirements
     *
     * - the caller must be admin of this contract
     * - endtime must be passed for all  question
     * - question id must be valid
     */
    function updateInvalidAnswerStatus(uint256[] memory questionIds)
        external
        override
    {
        require(isAdmin(msg.sender), "Must be admin");
        require(questionIds.length != 0, "questionIds length cannot be 0");
        for (uint256 i = 0; i < questionIds.length; i++) {
            uint256 questionId = questionIds[i];
            require(questionId < questions.length, "Invalid question id");
            Question storage question = questions[questionId];
            require(question.endTime <= block.timestamp, "Question is active");
            require(
                question.isAnswerCalculated == StatusCalculated.NotCalculated,
                "Answer is calculated"
            );
            question.isAnswerCalculated = StatusCalculated.Invalid;
            emit FinalAnswerCalculatedStatus(
                questionId,
                "",
                0,
                0,
                question.isAnswerCalculated
            );
        }
    }

    /**
     * @dev Allow Lithium Coordinator to add answerHashes to questions
     * the `questionIds` is the  array of question id
     * the `answerHashes` is the array  for answerHash of questionIds
     * Requirements
     *
     * - the caller must be admin of this contract
     * - endtime must be passed for all  question
     * - question id must be valid
     */
    function addAnswerHash(
        uint256[] memory _questionIds,
        Multihash[] memory _answerHashes
    ) external override {
        require(isAdmin(msg.sender), "Must be admin");
        require(_questionIds.length != 0, "questionIds length cannot be 0");
        require(
            _questionIds.length == _answerHashes.length,
            "argument length mismatch"
        );
        for (uint256 i = 0; i < _questionIds.length; i++) {
            uint256 questionId = _questionIds[i];
            require(questionId < questions.length, "Invalid question id");
            Question storage question = questions[questionId];
            require(
                question.isAnswerCalculated == StatusCalculated.Calculated,
                "Question must be calculated"
            );
            uint256 hashIdx = answerHashes.length;
            question.answerHashIdxs.push(hashIdx);
            Multihash memory multihash;
            multihash.digest = _answerHashes[i].digest;
            multihash.hashFunction = _answerHashes[i].hashFunction;
            multihash.size = _answerHashes[i].size;
            answerHashes.push(multihash);
            emit QuestionAnswerAdded(
                questionId,
                multihash.digest,
                multihash.hashFunction,
                multihash.size
            );
        }
    }

    /**
     * @dev Allow Lithium Coordinator to update the reputation score of wisdom nodes
     * Emits a { ReputationUpdated } event.
     *
     * Requirements
     *
     * - the caller must be admin of this contract
     * - the length of the array arguments must be equal
     * - the categoryIds must all be valid
     */
    function updateReputation(
        address[] memory addressesToUpdate,
        uint256[] memory categoryIds,
        uint256[] memory reputationScores
    ) external override {
        require(isAdmin(msg.sender), "Must be admin");
        require(
            addressesToUpdate.length != 0,
            "address length must be greater than zero"
        );
        require(
            addressesToUpdate.length == categoryIds.length &&
                categoryIds.length == reputationScores.length,
            "argument length mismatch"
        );
        for (uint256 i = 0; i < addressesToUpdate.length; i++) {
            require(categoryIds[i] < categories.length, "invalid categoryId");
            userReputationScores[addressesToUpdate[i]][
                categoryIds[i]
            ] += reputationScores[i];
        }
        emit ReputationUpdated(
            addressesToUpdate,
            categoryIds,
            reputationScores
        );
    }

    /**
     * @dev Allow Lithium Coordinator to update the MinimumStake
     * Emits a { MinimumStakeUpdated} event.
     *
     * Requirements
     *
     * - the caller must be admin of this contract
     */
    function updateMinimumStake(uint256 _minimumStake) external override {
        require(isAdmin(msg.sender), "Must be admin");
        minimumStake = _minimumStake;
        emit MinimumStakeUpdated(minimumStake);
    }

    /**
     * @dev Allow Lithium Coordinator to update the answer group rewrads
     * the `addressesToUpdate` is the  array of wisdom node  addresses
     * the `groupIds` is the array of answer group id for respective wisdom node address
     * the `rewardAmounts` is the array of final rewards for respective wisdom node address
     * Requirements
     *
     * - the caller must be admin of this contract
     * - the length of the array arguments must be equal
     * - answer must be calculated for groupids(all question id that belong in groupIds)
     * - rewards can't be updated again with same question id
     * - question id must be valid
     */
    function updateGroupRewardAmounts(
        address[] memory addressesToUpdate,
        uint256[] memory groupIds,
        uint256[] memory rewardAmounts
    ) external override {
        require(isAdmin(msg.sender), "Must be admin");
        require(
            addressesToUpdate.length == groupIds.length &&
                addressesToUpdate.length == rewardAmounts.length,
            "Array mismatch"
        );
        for (uint256 i = 0; i < groupIds.length; i++) {
            uint256[] memory questionIds = questionGroups[groupIds[i]]
                .questionIds;
            for (uint256 j = 0; j < questionIds.length; j++) {
                Question storage question = questions[questionIds[j]];
                require(
                    question.isAnswerCalculated !=
                        StatusCalculated.NotCalculated,
                    "Answer not calculated"
                );
            }
            AnswerGroup storage answerGroup = answerGroups[groupIds[i]][
                addressesToUpdate[i]
            ];
            require(
                answerGroup.answerer == addressesToUpdate[i],
                "Not valid answerer"
            );
            answerGroup.rewardAmount = rewardAmounts[i];
            answerGroup.isRewardCalculated = StatusCalculated.Calculated;
        }
        emit GroupRewardUpdated(addressesToUpdate, groupIds, rewardAmounts);
    }

    /**
     * @dev external interface for _createQuestion method
     * the `categoryId` is the id for the related category
     * the `bounty` is amount of tokens the questioner is offering for pricing information
     * the `description` is a description of the asset to price, ex 'The price of LITH token will be higher then'
     * the `endtime` is when all voting stops and votes are tallied and payouts become eligible relative to the block.timestamp
     * the `answerSet` is an array of values that represent equal to or greater than prices in usd
     *   Each answer except for the last represents the statement 'equal to or greather than the selected value and less than the next value in the array'
     *   with the last value representing the statement 'equal to or greater than the selected value'
     *   For example, an answerSet for the questions 'Will the price of the dow be greater or less than $35,000'
     *   would be [0,35000]
     *   An answerSet for the question 'Will the price of the dow be less then $35,000, between $35,000 and $37,000, or greater than $37,000'
     *   would be [0,35000,37000]
     */
    function createQuestion(
        uint16 categoryId,
        uint256 bounty,
        uint256 pricingTime,
        uint256 endTime,
        QuestionType questionType,
        string memory description,
        uint256[] memory answerSet,
        uint256 startTime
    ) external override {
        require(isAdmin(msg.sender), "Must be Admin");
        _createQuestion(
            categoryId,
            bounty,
            pricingTime,
            endTime,
            questionType,
            description,
            answerSet,
            startTime
        );
    }

    /**
     * @dev Given an array of question values creates a Question for each one and a QuestionSet for the entire array
     *
     * Emits a { QuestionGroupCreated } event.
     *
     */
    function createQuestionGroup(
        uint16[] memory categoryIds,
        uint256[] memory bounties,
        uint256[] memory pricingTimes,
        uint256[] memory endTimes,
        QuestionType[] memory questionTypes,
        string[] memory descriptions,
        uint256[][] memory answerSets,
        uint256[] memory startTimes,
        uint16 minimumRequiredAnswer
    ) external override {
        require(isAdmin(msg.sender), "Must be Admin");
        require(
            categoryIds.length == bounties.length &&
                categoryIds.length == pricingTimes.length &&
                categoryIds.length == endTimes.length &&
                categoryIds.length == questionTypes.length &&
                categoryIds.length == descriptions.length &&
                categoryIds.length == answerSets.length &&
                categoryIds.length == startTimes.length,
            "Array mismatch"
        );

        // get the pending id for the initial question in the set
        uint256 initialQuestionId = questions.length;
        uint256[] memory questionIds = new uint256[](categoryIds.length);

        for (uint256 i = 0; i < categoryIds.length; i++) {
            _createQuestion(
                categoryIds[i],
                bounties[i],
                pricingTimes[i],
                endTimes[i],
                questionTypes[i],
                descriptions[i],
                answerSets[i],
                startTimes[i]
            );
            questionIds[i] = initialQuestionId + i;
        }

        QuestionGroup memory questionGroup;
        questionGroup.id = questionGroups.length;
        questionGroup.questionIds = questionIds;
        questionGroup.minimumRequiredAnswer = minimumRequiredAnswer;
        questionGroups.push(questionGroup);

        emit QuestionGroupCreated(
            questionGroup.id,
            msg.sender,
            questionGroup.questionIds,
            questionGroup.minimumRequiredAnswer
        );
    }

    function answerQuestions(
        uint256 questionGroupId,
        uint256[] memory stakeAmounts,
        uint16[] memory answerIndexes
    ) external override {
        require(
            questionGroupId < questionGroups.length,
            "Invalid question group id"
        );
        uint256[] memory questionIds = questionGroups[questionGroupId]
            .questionIds;
        require(
            questionIds.length == stakeAmounts.length &&
                questionIds.length == answerIndexes.length,
            "Array mismatch"
        );
        for (uint256 i = 0; i < questionIds.length; i++) {
            answerQuestion(questionIds[i], stakeAmounts[i], answerIndexes[i]);
        }
        AnswerGroup memory answersGroup;
        answersGroup.answerer = msg.sender;
        answersGroup.questionGroupId = questionGroupId;
        answersGroup.answerIndexes = answerIndexes;
        answersGroup.stakeAmounts = stakeAmounts;
        answerGroups[questionGroupId][msg.sender] = answersGroup;
        emit AnswerGroupSetSubmitted(msg.sender, questionGroupId);
    }

    /**
     * @dev Allow users to claim rewards for answered questions
     * the `questionGroupIds` is the ids of the question groupss to claim the rewards for
     *
     * Requirements
     *
     * - the caller must have answered the questions
     */
    function claimRewards(uint256[] memory questionGroupIds) external override {
        for (uint256 i = 0; i < questionGroupIds.length; i++) {
            _claimReward(questionGroupIds[i]);
        }
    }

    /**
     * @dev Allow users to increase bid amount on specific question id
     * the `questionId` is the ids of the questions  to increase bid on the question
     * with Bidding amount lithBidAmount
     *
     */

    function increaseBid(uint256 questionId, uint256 lithBidAmount)
        external
        override
    {
        LithiumToken.transferFrom(msg.sender, address(this), lithBidAmount);
        _increaseBid(questionId, lithBidAmount);
    }

    /**
     * @dev Allow admin to refund node address with reward amount for question id
     * the `questionIds` is the array of question id for which refund amount to be updated
     * the `nodeAddresses` is the addresses of node which they bid amount on getting answers
     * the `refundAmounts` is the array of refund amount with respect to nodeAddresses
     */

    function refundBids(
        uint256[] memory questionIds,
        address[] memory nodeAddresses,
        uint256[] memory refundAmounts
    ) external override {
        require(isAdmin(msg.sender), "Must be admin");
        require(
            questionIds.length == nodeAddresses.length &&
                questionIds.length == refundAmounts.length,
            "argument length mismatch"
        );
        require(nodeAddresses.length > 0, "Node addresses length != 0");
        for (uint256 i = 0; i < questionIds.length; i++) {
            Question storage question = questions[i];
            require(
                question.startTime <= block.timestamp,
                "Question not started"
            );
            QuestionBid storage questionBid = questionBids[questionIds[i]][
                nodeAddresses[i]
            ];
            bool isRefunded = questionBid.isBidRefunded;
            require(!isRefunded, "Wsidom node already refunded");
            uint256 userBidAmount = questionBid.bidAmount;
            require(userBidAmount >= refundAmounts[i], "Refund > bid amount");
            questionBid.isBidRefunded = true;
            questionBid.bidAmount = userBidAmount - refundAmounts[i];
            question.bounty = question.bounty - refundAmounts[i];
            if (refundAmounts[i] > 0) {
                LithiumToken.transfer(nodeAddresses[i], refundAmounts[i]);
            }
            emit BidRefunded(
                questionIds[i],
                nodeAddresses[i],
                refundAmounts[i]
            );
        }
    }

    function updateRevealTiers(uint16[] memory _revealTiers) external override {
        require(isAdmin(msg.sender), "Must be admin");
        _updateRevealTiers(_revealTiers);
    }
}
