const Tinder = require("./index"),
  { Message, User, Match, Profile, Swipe } = require("./models"),
  { describe, it } = require("mocha"),
  { should } = require("chai");
const tinder = new Tinder("97a9cc72-3e4f-4e9e-8d91-4b59620155f6");
let message, match;

describe("Tinder", () => {
  it("getMeta", async () => {
    const meta = await tinder.getMeta();
    should().exist(meta);
    meta.should.be.a("object");
  });

  it("getMessage", async () => {
    message = await tinder.getMessage("5f69b16610c5380100adf38c");
    should().exist(message);
    message.should.be.an.instanceof(Message);
    message.id.should.equal("5f69b16610c5380100adf38c");
  });

  it("getUser", async () => {
    const user = await tinder.getUser("5f64c8e574721e0100ab23b7");
    should().exist(user);
    user.should.be.an.instanceof(User);
    user.id.should.equal("5f64c8e574721e0100ab23b7");
  });

  it("getMatch", async () => {
    match = await tinder.getMatch(
      "5f56864867a22e01000fae475f64c8e574721e0100ab23b7"
    );
    should().exist(match);
    match.should.be.an.instanceof(Match);
    match.id.should.equal("5f56864867a22e01000fae475f64c8e574721e0100ab23b7");
  });

  it("getMatchesByName", async () => {
    const matches = await tinder.getMatchesByName("Charly");
    should().exist(matches);
    matches.should.be.a("array").of.length(1);
    matches[0].should.be.an.instanceof(Match);
    matches[0].id.should.equal(
      "5f56864867a22e01000fae475f64c8e574721e0100ab23b7"
    );
  });

  it("getMatches", async () => {
    const matches = await tinder.getMatches(2);
    should().exist(matches);
    matches.should.be.a("array").of.length(2);
    matches[0].should.be.an.instanceof(Match);
  });

  it("getRecommendedUsers", async () => {
    const recs = await tinder.getRecommendedUsers();
    should().exist(recs);
    recs.should.be.a("array");
    if (recs.length > 0) recs[0].should.be.an.instanceof(User);
  });

  it("getSwipes", async () => {
    const swipes = await tinder.getSwipes();
    should().exist(swipes);
    swipes.should.be.a("array");
    if (swipes.length > 0) swipes[0].should.be.an.instanceof(Swipe);
  });

  it("getUpdatesSince", async () => {
    /* const updates = await tinder.getUpdatesSince(firstOfMonth);
		should().exist(updates);
		updates.shoud.be.a('object');
		updates.should.have.property('matches');
		updates.should.have.property('last_activity_date');*/
  });

  it("getProfile", async () => {
    const profile = await tinder.getProfile();
    should().exist(profile);
    profile.should.be.an.instanceof(Profile);
  });

  it("getLikeCount", async () => {
    const count = await tinder.getLikeCount();
    should().exist(count);
    count.should.be.a("number");
  });

  it("changePreferences", async () => {
    /* check connection, seems to kill all following requests
		const user = await tinder.changePreferences(18, 22, 1, 0, 50);
		should().exist(user);
		user.should.be.an.instanceof(Profile);
		user.ageMin.should.be.equal(18);
		user.ageMax.should.be.equal(22);
		user.genderFilter.should.be.equal(1);
		user.gender.should.be.equal(0);
		user.distanceFilter.should.be.equal(50);*/
  });
});

describe("Message", () => {
  it("getMatch", async () => {
    const msgMatch = await message.getMatch();
    should().exist(msgMatch);
    msgMatch.should.be.an.instanceof(Match);
  });

  it("getAuthor", async () => {
    const author = await message.getAuthor();
    should().exist(author);
    author.should.be.an.instanceof(User);
  });

  it("like", async () => {
    const ret = await message.like();
    should().exist(ret);
    ret.should.be.a("object");
  });

  it("dislike", async () => {
    const ret = await message.dislike();
    should().exist(ret);
    ret.should.be.a("object");
  });
});

describe("Match", () => {
  it("getUser", async () => {
    const user = await match.getUser();
    should().exist(user);
    user.should.be.an.instanceof(User);
  });

  it("sendMessage", async () => {
    /* teste mit anderem match
		const message = await match.sendMessage('hey');
		should().exist(message);
		message.should.be.an.instanceof(Message);*/
  });

  it("getMessages", async () => {
    const messages = await match.getMessages(10);
    should().exist(messages);
    messages.should.be.a("array").of.length(10);
    messages[0].should.be.an.instanceof(Message);
  });

  it("unmatch", async () => {
    /* teste mit anderem match
		await match.unmatch();*/
  });
});
