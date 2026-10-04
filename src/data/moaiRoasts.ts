/**
 * 250+ Bilingual Savage Moai Roasts & Notification Engine
 * Default: Hinglish 🇮🇳 | Switchable to Pure English 🌐
 * Crafted for maximum anti-dopamine discipline, GigaChad focus energy & savage humor.
 */

export interface BilingualRoast {
  id: string
  hinglish: {
    text: string
    subText?: string
  }
  english: {
    text: string
    subText?: string
  }
  auraDelta?: number
  tone: 'savage' | 'chad' | 'reality_check' | 'hilarious' | 'compliment'
}

export interface Roast {
  id: string
  text: string
  subText?: string
  auraDelta?: number
  tone: 'savage' | 'chad' | 'reality_check' | 'hilarious' | 'compliment'
}

export type RoastLanguage = 'hinglish' | 'english'

// ─── 1. BLOCKED APP ATTEMPT ROASTS (110 ENTRIES) ──────────────────────────────
export const APP_ATTEMPT_ROASTS_DB: BilingualRoast[] = [
  {
    id: 'ar1',
    hinglish: { text: "Reels dekhne se ghar nahi chalega bhai! 🗿", subText: "Wapas ja focus pe, time waste mat kar." },
    english: { text: "Doomscrolling won't pay your bills! Put the phone down 🗿", subText: "Get back to focus mode right now." },
    auraDelta: -100,
    tone: 'savage'
  },
  {
    id: 'ar2',
    hinglish: { text: "Insta band kar, baap ka sapna yaad hai? 🗿", subText: "Baap ke paise barbad karne me sharam nahi aati?" },
    english: { text: "Close Instagram! Remember why you started 🗿", subText: "Stop disrespecting your potential with cheap dopamine." },
    auraDelta: -150,
    tone: 'reality_check'
  },
  {
    id: 'ar3',
    hinglish: { text: "Aura -50,000! Tu sach me Instagram khol raha tha? 🗿", subText: "Sigma grindset chhod ke dopamine ka slave ban raha hai." },
    english: { text: "Aura -50,000! Were you seriously opening Instagram? 🗿", subText: "Trading your GigaChad focus for 15-second garbage." },
    auraDelta: -500,
    tone: 'savage'
  },
  {
    id: 'ar4',
    hinglish: { text: "Teri crush reels dekhne walo ko reply nahi deti 🗿", subText: "Successful banega tabhi wo dekhegi." },
    english: { text: "Your crush doesn't date doomscrollers with zero ambition 🗿", subText: "Build something extraordinary instead." },
    auraDelta: -200,
    tone: 'reality_check'
  },
  {
    id: 'ar5',
    hinglish: { text: "Scroll karke Ambani nahi banega gadhe 🗿", subText: "Focus session active hai, chup chap kaam kar." },
    english: { text: "Scrolling won't make you a billionaire 🗿", subText: "Focus timer is active. Get back to work." },
    auraDelta: -100,
    tone: 'hilarious'
  },
  {
    id: 'ar6',
    hinglish: { text: "Moai is deeply disappointed in your weak willpower 🗿", subText: "Ek notification aayi nahi ki pighal gaya?" },
    english: { text: "Moai is deeply disappointed in your fragile willpower 🗿", subText: "One vibration and you folded immediately?" },
    auraDelta: -300,
    tone: 'chad'
  },
  {
    id: 'ar7',
    hinglish: { text: "Padhle bhai, varna agle saal bhi drop lega 🗿", subText: "Competitor 14 ghante padh raha hai, tu reels dekh raha hai." },
    english: { text: "Lock in! Your competitors are outworking you right now 🗿", subText: "While you scroll, they are building their empire." },
    auraDelta: -400,
    tone: 'reality_check'
  },
  {
    id: 'ar8',
    hinglish: { text: "Dopamine ka slave mat ban, Lock In kar 🗿", subText: "Algorithm tujhe manipulate kar raha hai." },
    english: { text: "Stop being an algorithm slave. Lock In 🗿", subText: "Reclaim your dopamine receptors and dominate." },
    auraDelta: -150,
    tone: 'chad'
  },
  {
    id: 'ar9',
    hinglish: { text: "Ek aur reel dekhne se marks/paisa nahi badhega 🗿", subText: "15 second ki reel ke piche apna future barbad mat kar." },
    english: { text: "One more short won't improve your bank account 🗿", subText: "Don't sacrifice your future for 15 seconds of junk." },
    auraDelta: -100,
    tone: 'reality_check'
  },
  {
    id: 'ar10',
    hinglish: { text: "Bhai sach bata, tujhe fail hona pasand hai kya? 🗿", subText: "Focus timer pause karne ki himmat kaise hui?" },
    english: { text: "Be honest, do you actually enjoy failing? 🗿", subText: "How dare you try to interrupt your focus timer?" },
    auraDelta: -250,
    tone: 'savage'
  },
  {
    id: 'ar11',
    hinglish: { text: "Aukaat me reh, Reels band kar aur kaam khatam kar 🗿", subText: "Jab tak target pura na ho, screen lock rahegi." },
    english: { text: "Show some discipline. Close the app and finish your task 🗿", subText: "Until your session ends, distractions are locked." },
    auraDelta: -200,
    tone: 'savage'
  },
  {
    id: 'ar12',
    hinglish: { text: "Elon Musk raat ko 3 baje reels scroll nahi karta 🗿", subText: "GigaChad ban ya average rehke roti tod." },
    english: { text: "High performers don't waste hours doomscrolling 🗿", subText: "Be exceptional or stay broke and average." },
    auraDelta: -300,
    tone: 'chad'
  },
  {
    id: 'ar13',
    hinglish: { text: "Squad streak todne chala tha? Dost chappal se marenge 🗿", subText: "Pura squad tere focus pe depend karta hai." },
    english: { text: "Trying to break the squad streak? Your crew will disown you 🗿", subText: "Your whole squad's multiplier depends on your discipline." },
    auraDelta: -500,
    tone: 'hilarious'
  },
  {
    id: 'ar14',
    hinglish: { text: "Bro thought he could sneak in 2 minutes of YouTube 💀", subText: "Moai ki aankhein har jagah hain. Wapas ja!" },
    english: { text: "Bro thought he could sneak 2 minutes of YouTube 💀", subText: "Moai's shield is watching everything. Return to work!" },
    auraDelta: -150,
    tone: 'hilarious'
  },
  {
    id: 'ar15',
    hinglish: { text: "Insta pe dusro ki life dekh ke kab tak royega? 🗿", subText: "Khud ki life banana shuru kar." },
    english: { text: "How long will you envy other people's lives on Instagram? 🗿", subText: "Start building an epic life of your own." },
    auraDelta: -200,
    tone: 'reality_check'
  },
  {
    id: 'ar16',
    hinglish: { text: "Tere dosto ne package nikaal liya, tu yaha meme dekh raha hai 🗿", subText: "Reality check le aur kitab/code khol." },
    english: { text: "Your peers are getting promoted while you watch memes 🗿", subText: "Face reality and open your textbook or IDE." },
    auraDelta: -350,
    tone: 'reality_check'
  },
  {
    id: 'ar17',
    hinglish: { text: "Moai Shield Activated: Chal nikal yahan se 🗿", subText: "No Instagram. No YouTube. Only Grind." },
    english: { text: "Moai Shield Activated: Access Denied 🗿", subText: "Zero distractions permitted. Back to the grind." },
    auraDelta: -100,
    tone: 'chad'
  },
  {
    id: 'ar18',
    hinglish: { text: "Willpower 0, Excuses 100 🤡", subText: "Kal karega na? Aaj kyu nahi kar raha?" },
    english: { text: "Willpower: 0. Excuses: 100 🤡", subText: "Said you'd do it tomorrow? Do it right now." },
    auraDelta: -200,
    tone: 'savage'
  },
  {
    id: 'ar19',
    hinglish: { text: "Dopamine cheap hai, Success expensive hai 🗿", subText: "Price pay kar aur screen off kar." },
    english: { text: "Dopamine is cheap. Success is earned 🗿", subText: "Pay the price of discipline and close this app." },
    auraDelta: -150,
    tone: 'chad'
  },
  {
    id: 'ar20',
    hinglish: { text: "Abe chomu, 20 minute nahi hue aur hath me phone aa gaya? 🗿", subText: "Phone ko side me phek aur focus kar." },
    english: { text: "Not even 20 minutes and you reached for your phone? 🗿", subText: "Put the phone face down and lock in." },
    auraDelta: -150,
    tone: 'hilarious'
  },
  {
    id: 'ar21',
    hinglish: { text: "Reel dekhne se dopamine milega, bank balance nahi 🗿", subText: "Gareeb rehne ka shauk hai toh khol le Insta." },
    english: { text: "Reels give dopamine, not money 🗿", subText: "If you love being broke, go ahead and scroll." },
    auraDelta: -250,
    tone: 'savage'
  },
  {
    id: 'ar22',
    hinglish: { text: "Tumhare jaise log hi bolte hain 'Kismat kharab hai' 🗿", subText: "Kismat nahi, focus kharab hai tera." },
    english: { text: "People like you always blame bad luck 🗿", subText: "It's not bad luck, it's your terrible focus." },
    auraDelta: -300,
    tone: 'reality_check'
  },
  {
    id: 'ar23',
    hinglish: { text: "Mummy ko batau ki tu padhai ke naam pe kya dekh raha tha? 🗿", subText: "Insta band kar chup chap." },
    english: { text: "Should I tell your family what you do instead of studying? 🗿", subText: "Close this distraction immediately." },
    auraDelta: -200,
    tone: 'hilarious'
  },
  {
    id: 'ar24',
    hinglish: { text: "Aura Points -999999! Clown moment detected 🤡", subText: "Wapas ja aur GigaChad ban." },
    english: { text: "Aura -999,999! Certified Clown Behavior 🤡", subText: "Return to your session and redeem your dignity." },
    auraDelta: -999,
    tone: 'savage'
  },
  {
    id: 'ar25',
    hinglish: { text: "Bhai tere competition wale so nahi rahe, tu reels me laga hai 🗿", subText: "Exam/Job me rone mat aana fir." },
    english: { text: "Your rivals are wide awake mastering their craft 🗿", subText: "Don't cry when results arrive." },
    auraDelta: -300,
    tone: 'reality_check'
  },
  {
    id: 'ar26',
    hinglish: { text: "Focus mode ON hai. Gate band hai. Chal bhaag! 🗿", subText: "Scrolln't shield bypass nahi hoga." },
    english: { text: "Focus Mode Active. Gates Locked. Begone! 🗿", subText: "Scrolln't shield cannot be bypassed." },
    auraDelta: -100,
    tone: 'chad'
  },
  {
    id: 'ar27',
    hinglish: { text: "Phone hath me leke baithne se portfolio nahi banta 🗿", subText: "Code kar ya assignment likh." },
    english: { text: "Staring at feeds won't build your portfolio 🗿", subText: "Write code, study, or execute your goals." },
    auraDelta: -150,
    tone: 'reality_check'
  },
  {
    id: 'ar28',
    hinglish: { text: "15 minute bhi chup baith nahi sakta tu? 🗿", subText: "Attention span goldfish se bhi kam ho gaya tera." },
    english: { text: "Can't you sit still for even 15 minutes? 🗿", subText: "Your attention span is smaller than a goldfish." },
    auraDelta: -200,
    tone: 'savage'
  },
  {
    id: 'ar29',
    hinglish: { text: "Insta pe like aane se rent pay nahi hota bhai 🗿", subText: "Kaam pe dhyan de." },
    english: { text: "Instagram likes won't pay your rent 🗿", subText: "Focus on real value creation." },
    auraDelta: -150,
    tone: 'reality_check'
  },
  {
    id: 'ar30',
    hinglish: { text: "Moai is strictly enforcing your life goals 🗿", subText: "App closed. Now focus on your future." },
    english: { text: "Moai is enforcing your ambition by force 🗿", subText: "App closed. Now focus on your future." },
    auraDelta: -100,
    tone: 'chad'
  },
  {
    id: 'ar31',
    hinglish: { text: "Abe padhle, rishtedaar taane maarne tayyar baithe hain 🗿", subText: "Sharma ji ke bete ne offer nikal liya." },
    english: { text: "Study hard! The naysayers are waiting for you to fail 🗿", subText: "Prove them all wrong with relentless discipline." },
    auraDelta: -300,
    tone: 'hilarious'
  },
  {
    id: 'ar32',
    hinglish: { text: "Reel scroll karne se finger exercise hoti hai, dimag nahi 🗿", subText: "Brainrot se bahar nikal." },
    english: { text: "Endless scrolling only exercises your thumb, not your brain 🗿", subText: "Escape the brainrot cycle." },
    auraDelta: -100,
    tone: 'savage'
  },
  {
    id: 'ar33',
    hinglish: { text: "BGMI khel ke eSports athlete banega kya? 🗿", subText: "Khelne ka time baad me aayega, pehle focus." },
    english: { text: "Gaming won't solve your real-world problems 🗿", subText: "Play later. Conquer your actual goals first." },
    auraDelta: -200,
    tone: 'hilarious'
  },
  {
    id: 'ar34',
    hinglish: { text: "Shorts dekh ke attention span barbaad ho chuka hai tera 🗿", subText: "Reset your dopamine receptors. Go back!" },
    english: { text: "Short-form video has fried your dopamine receptors 🗿", subText: "Rebuild deep focus. Return to your session!" },
    auraDelta: -250,
    tone: 'reality_check'
  },
  {
    id: 'ar35',
    hinglish: { text: "Lock In or Get Cooked. Choice teri hai 🗿", subText: "Agar abhi nahi toh kabhi nahi." },
    english: { text: "Lock In or Get Cooked. The choice is yours 🗿", subText: "If not now, when?" },
    auraDelta: -200,
    tone: 'chad'
  },
  {
    id: 'ar36',
    hinglish: { text: "Tere future self ne message bheja hai: 'Phone rakh de!' 🗿", subText: "5 saal baad regret karega agar abhi distracted raha." },
    english: { text: "Message from your future self: 'Put down the phone!' 🗿", subText: "You will deeply regret today's wasted hours." },
    auraDelta: -300,
    tone: 'reality_check'
  },
  {
    id: 'ar37',
    hinglish: { text: "Ek aur distraction = 1 aur mahina berozgari 🗿", subText: "Focus session finish kar." },
    english: { text: "Every distraction delays your success by another month 🗿", subText: "Finish this focus session." },
    auraDelta: -200,
    tone: 'savage'
  },
  {
    id: 'ar38',
    hinglish: { text: "Sigma rule #1: Never touch phone during focus hours 🗿", subText: "Be a real warrior." },
    english: { text: "Sigma Rule #1: Never break your focus session 🗿", subText: "Master your impulses like a true champion." },
    auraDelta: -100,
    tone: 'chad'
  },
  {
    id: 'ar39',
    hinglish: { text: "Insta pe model dekh ke time waste karne wale Sigma nahi hote 🗿", subText: "Go back to work." },
    english: { text: "Drooling over social media models is peak weakness 🗿", subText: "Close the feed and get back to work." },
    auraDelta: -250,
    tone: 'savage'
  },
  {
    id: 'ar40',
    hinglish: { text: "Moai Shield: Access Denied. Cry about it 🗿", subText: "Focus session me no entry." },
    english: { text: "Moai Shield: Access Denied. Cry about it 🗿", subText: "Zero tolerance during focus mode." },
    auraDelta: -100,
    tone: 'chad'
  },
  {
    id: 'ar41',
    hinglish: { text: "Tu har 5 minute me phone check kyu karta hai? Koi PM hai tu? 🗿", subText: "No one texted you bro, get back to work." },
    english: { text: "Why check your phone every 5 minutes? Are you the Prime Minister? 🗿", subText: "Nobody texted you. Back to work." },
    auraDelta: -150,
    tone: 'hilarious'
  },
  {
    id: 'ar42',
    hinglish: { text: "Baap ki mehnat ke paise ka thoda toh lihaaz kar 🗿", subText: "Tu reels dekh raha hai wo mehnat kar rahe hain." },
    english: { text: "Respect the sacrifices made for your education 🗿", subText: "Stop trading hard work for senseless scrolling." },
    auraDelta: -400,
    tone: 'reality_check'
  },
  {
    id: 'ar43',
    hinglish: { text: "Attention span: 2 seconds. Motivation: 0. Excuses: Pro Max 🗿", subText: "Prove Moai wrong by finishing this session." },
    english: { text: "Attention span: 2 sec. Motivation: 0. Excuses: Pro Max 🗿", subText: "Prove Moai wrong by finishing strong." },
    auraDelta: -200,
    tone: 'savage'
  },
  {
    id: 'ar44',
    hinglish: { text: "Chal wapas ja, abhi timer khatam nahi hua 🗿", subText: "Strict lockdown mode active." },
    english: { text: "Turn back. The timer is still ticking 🗿", subText: "Strict focus mode remains active." },
    auraDelta: -100,
    tone: 'chad'
  },
  {
    id: 'ar45',
    hinglish: { text: "Reels dekhne walo ka career AI kha jayega 🗿", subText: "Skill build kar chup chap." },
    english: { text: "Passive scrollers will be replaced by AI 🗿", subText: "Build deep, irreplaceable human skills instead." },
    auraDelta: -250,
    tone: 'reality_check'
  },
  {
    id: 'ar46',
    hinglish: { text: "Bhai break lene ka time abhi nahi aaya 🗿", subText: "Sirf 10 minute huye hain session shuru kiye." },
    english: { text: "It is way too early for a break 🗿", subText: "You barely started 10 minutes ago." },
    auraDelta: -150,
    tone: 'hilarious'
  },
  {
    id: 'ar47',
    hinglish: { text: "Moai says: Not on my watch, kid 🗿", subText: "Distracting app dismissed." },
    english: { text: "Moai says: Not on my watch 🗿", subText: "Distraction eliminated immediately." },
    auraDelta: -100,
    tone: 'chad'
  },
  {
    id: 'ar48',
    hinglish: { text: "Aura down by 5000 points. Wapas focus pe ja 🗿", subText: "Recover your aura with deep focus." },
    english: { text: "Aura down by 5,000 points. Return to focus 🗿", subText: "Reclaim your dignity through deep work." },
    auraDelta: -500,
    tone: 'savage'
  },
  {
    id: 'ar49',
    hinglish: { text: "Snap streak bachane se Zindagi nahi bachti 🗿", subText: "Actual focus streak bacha Scrolln't pe." },
    english: { text: "Snapchat streaks won't save your career 🗿", subText: "Save your real focus streak on Scrolln't." },
    auraDelta: -200,
    tone: 'reality_check'
  },
  {
    id: 'ar50',
    hinglish: { text: "Padhai me mann nahi lagta toh मजदूरी karega kya? 🗿", subText: "Focus kar chup chap." },
    english: { text: "If you can't focus on work, how will you survive? 🗿", subText: "Build discipline right now." },
    auraDelta: -300,
    tone: 'savage'
  },
  {
    id: 'ar51',
    hinglish: { text: "Reels ka algorithm tere dimag ko control kar raha hai 🗿", subText: "Take back control." },
    english: { text: "The algorithm is farming your attention for profit 🗿", subText: "Take back control of your mind." },
    auraDelta: -150,
    tone: 'chad'
  },
  {
    id: 'ar52',
    hinglish: { text: "Bhai tu YouTube recommendation dekhne nahi, kaam karne baitha tha 🗿", subText: "Tab band kar." },
    english: { text: "You sat down to work, not to browse recommendations 🗿", subText: "Close the tab and execute." },
    auraDelta: -150,
    tone: 'hilarious'
  },
  {
    id: 'ar53',
    hinglish: { text: "Dopamine hits lene ki aadat chhod 🗿", subText: "Real pleasure achievement me hai." },
    english: { text: "Quit craving quick dopamine hits 🗿", subText: "Real fulfillment comes from hard accomplishment." },
    auraDelta: -200,
    tone: 'chad'
  },
  {
    id: 'ar54',
    hinglish: { text: "Tu kal bhi yahi bol raha tha ki 'aaj 8 ghante padhunga' 🗿", subText: "Aur ab reels dekh raha hai?" },
    english: { text: "Yesterday you swore you'd study for 8 hours 🗿", subText: "And here you are opening junk feeds again." },
    auraDelta: -300,
    tone: 'reality_check'
  },
  {
    id: 'ar55',
    hinglish: { text: "Moai is judging your weak mindset 🗿", subText: "Stay hard. Stay focused." },
    english: { text: "Moai is silently judging your fragile mindset 🗿", subText: "Stay hard. Stay locked in." },
    auraDelta: -100,
    tone: 'chad'
  },
  {
    id: 'ar56',
    hinglish: { text: "Ye app kholne se pehle socha tha streak toot sakti hai? 🗿", subText: "Streak safe rakho, app band karo." },
    english: { text: "Did you consider that opening this could break your streak? 🗿", subText: "Keep your streak safe and exit." },
    auraDelta: -200,
    tone: 'reality_check'
  },
  {
    id: 'ar57',
    hinglish: { text: "Jab tak goal complete na ho, phone ko hath lagana paap hai 🗿", subText: "Focus session in progress." },
    english: { text: "Until the timer rings, touching this phone is forbidden 🗿", subText: "Session in active progress." },
    auraDelta: -150,
    tone: 'savage'
  },
  {
    id: 'ar58',
    hinglish: { text: "Berozgari rate dekh ke bhi sharam nahi aati? 🗿", subText: "Hard work kar bhai." },
    english: { text: "Look at the economy and have some urgency 🗿", subText: "Work hard while you have the opportunity." },
    auraDelta: -350,
    tone: 'reality_check'
  },
  {
    id: 'ar59',
    hinglish: { text: "Notification dekhne gaya tha aur 1 ghanta udd gaya 🗿", subText: "Scrolln't will save you from yourself." },
    english: { text: "Checked one notification and lost 1 hour? 🗿", subText: "Scrolln't will protect you from self-sabotage." },
    auraDelta: -150,
    tone: 'hilarious'
  },
  {
    id: 'ar60',
    hinglish: { text: "Tu wahi hai na jo bolta tha 'Mera focus bohot strong hai'? 🗿", subText: "Haha dikh gaya kitna strong hai." },
    english: { text: "Aren't you the one who claimed to have laser focus? 🗿", subText: "We just saw how brittle it really was." },
    auraDelta: -200,
    tone: 'savage'
  },
  {
    id: 'ar61',
    hinglish: { text: "Insta stories pe logo ki party dekh ke depress mat ho 🗿", subText: "Kaam kar taaki kal tu party de sake." },
    english: { text: "Stop watching other people party while you stagnate 🗿", subText: "Work now so you can celebrate later." },
    auraDelta: -250,
    tone: 'reality_check'
  },
  {
    id: 'ar62',
    hinglish: { text: "Shield triggered! Tu bura mat maan, ye tere bhale ke liye hai 🗿", subText: "Back to study/work." },
    english: { text: "Shield triggered! Don't take it personally, it's for your greatness 🗿", subText: "Back to study and work." },
    auraDelta: -100,
    tone: 'chad'
  },
  {
    id: 'ar63',
    hinglish: { text: "Crush ka story check karne se reply nahi aayega 🗿", subText: "Degree ya startup bna pehle." },
    english: { text: "Stalking stories won't make them notice you 🗿", subText: "Build real status and achievement first." },
    auraDelta: -200,
    tone: 'hilarious'
  },
  {
    id: 'ar64',
    hinglish: { text: "Phone ko drawer me daal aur Lock in kar 🗿", subText: "No distractions allowed." },
    english: { text: "Toss the phone in a drawer and Lock In 🗿", subText: "Zero tolerance for weak impulses." },
    auraDelta: -150,
    tone: 'chad'
  },
  {
    id: 'ar65',
    hinglish: { text: "Aise distraction se toh 10th ka bacha bhi aage nikal jayega 🗿", subText: "Show some discipline." },
    english: { text: "Even a middle schooler has more focus than you right now 🗿", subText: "Show some self-discipline." },
    auraDelta: -200,
    tone: 'savage'
  },
  {
    id: 'ar66',
    hinglish: { text: "1000 XP lost in spirit! Go back to work 🗿", subText: "Recover XP by finishing session." },
    english: { text: "1,000 XP lost in spirit! Go back to work 🗿", subText: "Earn it back by completing this session." },
    auraDelta: -1000,
    tone: 'chad'
  },
  {
    id: 'ar67',
    hinglish: { text: "Dopamine detox shuru kar bhai, zaroorat hai tujhe 🗿", subText: "Start right now." },
    english: { text: "You desperately need a dopamine detox 🗿", subText: "Start right now by staying off this app." },
    auraDelta: -150,
    tone: 'reality_check'
  },
  {
    id: 'ar68',
    hinglish: { text: "Bhai tere squad wale full grind pe hain aur tu reels me? 🗿", subText: "Squad ranking drop ho jayegi." },
    english: { text: "Your squad is grinding at full throttle while you scroll 🗿", subText: "Don't drag down the squad ranking." },
    auraDelta: -300,
    tone: 'hilarious'
  },
  {
    id: 'ar69',
    hinglish: { text: "GigaChad does not scroll. GigaChad creates 🗿", subText: "Be a creator, not a consumer." },
    english: { text: "GigaChads do not scroll. GigaChads create 🗿", subText: "Be a creator, not a mindless consumer." },
    auraDelta: -200,
    tone: 'chad'
  },
  {
    id: 'ar70',
    hinglish: { text: "Chal chal hawa aane de, focus timer pura kar 🗿", subText: "Shield blocked the app." },
    english: { text: "Keep walking. Complete your focus timer first 🗿", subText: "Shield successfully intercepted the distraction." },
    auraDelta: -100,
    tone: 'savage'
  },
  {
    id: 'ar71',
    hinglish: { text: "100 din baad regret karne se accha aaj 1 ghanta focus karle 🗿", subText: "Today's pain is tomorrow's glory." },
    english: { text: "Better 1 hour of focus today than 100 days of regret 🗿", subText: "Today's discomfort is tomorrow's victory." },
    auraDelta: -200,
    tone: 'reality_check'
  },
  {
    id: 'ar72',
    hinglish: { text: "Twitter/X pe ladai dekhne se tera salary nahi badhega 🗿", subText: "Shut the feed down." },
    english: { text: "Watching Twitter flame wars won't double your salary 🗿", subText: "Shut down the feed and get to work." },
    auraDelta: -150,
    tone: 'hilarious'
  },
  {
    id: 'ar73',
    hinglish: { text: "Reddit pe timepass band kar, code deploy kar 🗿", subText: "Action speaks louder than comments." },
    english: { text: "Stop wasting hours on Reddit. Ship your product 🗿", subText: "Execution is the only metric that matters." },
    auraDelta: -200,
    tone: 'chad'
  },
  {
    id: 'ar74',
    hinglish: { text: "Tumhare jaise log kal kare so aaj nahi, parso karte hain 🗿", subText: "Procrastination band karo." },
    english: { text: "Master of putting off until tomorrow what was due yesterday 🗿", subText: "End the procrastination loop now." },
    auraDelta: -200,
    tone: 'savage'
  },
  {
    id: 'ar75',
    hinglish: { text: "Shield Active: Dopamine demon blocked at the gate 🗿", subText: "+50 Aura for staying protected." },
    english: { text: "Shield Active: Dopamine parasite blocked at the gate 🗿", subText: "+50 Aura for remaining protected." },
    auraDelta: 50,
    tone: 'chad'
  },
  {
    id: 'ar76',
    hinglish: { text: "Screen time 7 ghante ho gaya hai sharam kar 🗿", subText: "Reclaim your life." },
    english: { text: "Your screen time is alarming. Have some self-respect 🗿", subText: "Reclaim your waking hours." },
    auraDelta: -300,
    tone: 'reality_check'
  },
  {
    id: 'ar77',
    hinglish: { text: "Phone chhu ke tune weak hone ka saboot de diya 🗿", subText: "Now prove you have strength by going back." },
    english: { text: "Reaching for this phone proved weakness 🗿", subText: "Now prove your strength by returning to focus." },
    auraDelta: -150,
    tone: 'chad'
  },
  {
    id: 'ar78',
    hinglish: { text: "Focus break kiya toh 50 pushups lagane padenge 🗿", subText: "No free passes." },
    english: { text: "Break focus and you owe 50 pushups immediately 🗿", subText: "Zero tolerance for undisciplined minds." },
    auraDelta: -200,
    tone: 'hilarious'
  },
  {
    id: 'ar79',
    hinglish: { text: "Moai is disgusted by your lack of commitment 🗿", subText: "Lock in immediately." },
    english: { text: "Moai is disgusted by your lack of commitment 🗿", subText: "Re-engage with intense focus immediately." },
    auraDelta: -250,
    tone: 'savage'
  },
  {
    id: 'ar80',
    hinglish: { text: "Ghar walo ke sapno pe paani mat pher reels dekh ke 🗿", subText: "Make them proud." },
    english: { text: "Don't extinguish your family's hopes for 30-second clips 🗿", subText: "Make them proud through hard work." },
    auraDelta: -350,
    tone: 'reality_check'
  },
  {
    id: 'ar81',
    hinglish: { text: "Shorts dekh ke mental peace nahi milega 🗿", subText: "Only accomplishments give real peace." },
    english: { text: "Short video feeds destroy your peace of mind 🗿", subText: "True serenity comes from disciplined mastery." },
    auraDelta: -150,
    tone: 'chad'
  },
  {
    id: 'ar82',
    hinglish: { text: "Bhai tere dream university/company me reels nahi maangte 🗿", subText: "Grind or get left behind." },
    english: { text: "Elite companies and colleges don't hire TikTok fans 🗿", subText: "Grind or get left in the dust." },
    auraDelta: -300,
    tone: 'reality_check'
  },
  {
    id: 'ar83',
    hinglish: { text: "Moai Stone Wall: App is permanently quarantined 🗿", subText: "Until your focus timer reaches zero." },
    english: { text: "Moai Stone Wall: Application is strictly quarantined 🗿", subText: "Locked until focus timer hits zero." },
    auraDelta: -100,
    tone: 'chad'
  },
  {
    id: 'ar84',
    hinglish: { text: "Snapchat filters se life sundar nahi banti 🗿", subText: "Real work makes a real life." },
    english: { text: "Camera filters won't beautify an empty resume 🗿", subText: "Real work creates a real life." },
    auraDelta: -200,
    tone: 'hilarious'
  },
  {
    id: 'ar85',
    hinglish: { text: "Willpower recharge mode: Go finish your session 🗿", subText: "You are stronger than this urge." },
    english: { text: "Willpower Recharge: Finish your session 🗿", subText: "You are far stronger than this cheap urge." },
    auraDelta: 100,
    tone: 'chad'
  },
  {
    id: 'ar86',
    hinglish: { text: "Tu har baar 'Bas 5 minute' bolke 2 ghante barbaad karta hai 🗿", subText: "Not today." },
    english: { text: "You always say 'Just 5 mins' and lose 2 hours 🗿", subText: "Not today. Access denied." },
    auraDelta: -250,
    tone: 'reality_check'
  },
  {
    id: 'ar87',
    hinglish: { text: "Focus timer chalu hai. Shame on you! 🗿", subText: "Keep grinding." },
    english: { text: "Focus timer is actively running. Shame on you! 🗿", subText: "Keep grinding." },
    auraDelta: -150,
    tone: 'savage'
  },
  {
    id: 'ar88',
    hinglish: { text: "Ye app kholne se -100 Aura deduction ho gaya 🗿", subText: "Wapas jao." },
    english: { text: "Opening this app incurred an instant -100 Aura penalty 🗿", subText: "Return to focus." },
    auraDelta: -100,
    tone: 'savage'
  },
  {
    id: 'ar89',
    hinglish: { text: "Deep work is your superpower. Don't throw it away 🗿", subText: "Stay focused." },
    english: { text: "Deep work is your ultimate superpower. Don't waste it 🗿", subText: "Stay locked in." },
    auraDelta: 150,
    tone: 'chad'
  },
  {
    id: 'ar90',
    hinglish: { text: "Aaj ka kaam kal pe chhodne wale losers hote hain 🗿", subText: "Be a winner." },
    english: { text: "Only losers push today's work to tomorrow 🗿", subText: "Be a relentless winner." },
    auraDelta: -200,
    tone: 'savage'
  },
  {
    id: 'ar91',
    hinglish: { text: "Tu reels dekhega aur AI tere sapne cheen lega 🗿", subText: "Wake up." },
    english: { text: "Keep scrolling and AI will take everything you wanted 🗿", subText: "Wake up and sharpen your mind." },
    auraDelta: -300,
    tone: 'reality_check'
  },
  {
    id: 'ar92',
    hinglish: { text: "Moai says: Your future self is begging you to focus 🗿", subText: "Don't disappoint them." },
    english: { text: "Moai says: Your future self is begging you to lock in 🗿", subText: "Don't let your future down." },
    auraDelta: 100,
    tone: 'chad'
  },
  {
    id: 'ar93',
    hinglish: { text: "Dopamine chasers don't get the trophy 🗿", subText: "Winners stay in the arena." },
    english: { text: "Dopamine chasers never lift the trophy 🗿", subText: "Champions stay in the arena." },
    auraDelta: -150,
    tone: 'chad'
  },
  {
    id: 'ar94',
    hinglish: { text: "Phone rakh aur 10 deep breaths le, fir wapas lag ja 🗿", subText: "Reset and conquer." },
    english: { text: "Put the phone down, take 10 deep breaths, and conquer 🗿", subText: "Reset your state." },
    auraDelta: 50,
    tone: 'chad'
  },
  {
    id: 'ar95',
    hinglish: { text: "Is app me tere liye kuch nahi rakha bhai 🗿", subText: "Empty pixels. Zero value." },
    english: { text: "There is nothing in this app for your future 🗿", subText: "Empty pixels. Zero return." },
    auraDelta: -100,
    tone: 'reality_check'
  },
  {
    id: 'ar96',
    hinglish: { text: "Squad multiplier drop hone se pehle wapas chalo 🗿", subText: "Protect the streak." },
    english: { text: "Return before you drag down the squad multiplier 🗿", subText: "Protect the collective streak." },
    auraDelta: -200,
    tone: 'hilarious'
  },
  {
    id: 'ar97',
    hinglish: { text: "Attention economy ka target mat bano 🗿", subText: "Be the master of your attention." },
    english: { text: "Don't be a casualty in the attention economy 🗿", subText: "Be the master of your own mind." },
    auraDelta: 100,
    tone: 'chad'
  },
  {
    id: 'ar98',
    hinglish: { text: "Moai Shield: Blocked with extreme prejudice 🗿", subText: "No passage." },
    english: { text: "Moai Shield: Blocked with extreme prejudice 🗿", subText: "No access granted." },
    auraDelta: -100,
    tone: 'savage'
  },
  {
    id: 'ar99',
    hinglish: { text: "Ek session finish kar, fir flex karna 🗿", subText: "Earn the right to rest." },
    english: { text: "Finish the session before you think of relaxing 🗿", subText: "Earn your rest." },
    auraDelta: 100,
    tone: 'chad'
  },
  {
    id: 'ar100',
    hinglish: { text: "Aura: +0 for scrolling. +10,000 for finishing this session 🗿", subText: "Choose wisely." },
    english: { text: "Aura: +0 for scrolling. +10,000 for finishing the session 🗿", subText: "Choose wisely." },
    auraDelta: 500,
    tone: 'chad'
  },
  {
    id: 'ar101',
    hinglish: { text: "Jab tak tumhara target hit nahi hota, feed open nahi hoga 🗿", subText: "Strictly enforced." },
    english: { text: "Until your target is achieved, feeds remain sealed 🗿", subText: "Strictly enforced." },
    auraDelta: -100,
    tone: 'chad'
  },
  {
    id: 'ar102',
    hinglish: { text: "Reels dekh ke muskuraane se reality nahi badalti 🗿", subText: "Build a life you don't need to escape from." },
    english: { text: "Laughing at memes won't fix your real life 🗿", subText: "Build a life you don't need to escape from." },
    auraDelta: -250,
    tone: 'reality_check'
  },
  {
    id: 'ar103',
    hinglish: { text: "Moai is not mad, just disappointed in your discipline 🗿", subText: "Do better." },
    english: { text: "Moai is not angry, just disappointed in your discipline 🗿", subText: "Rise above it." },
    auraDelta: -200,
    tone: 'savage'
  },
  {
    id: 'ar104',
    hinglish: { text: "Tere idol ne kabhi focus time pe phone scroll nahi kiya 🗿", subText: "Act like who you want to be." },
    english: { text: "Your idols never wasted their prime years scrolling 🗿", subText: "Act like the person you aspire to become." },
    auraDelta: -300,
    tone: 'chad'
  },
  {
    id: 'ar105',
    hinglish: { text: "Distraction intercepted! +100 Willpower points 🗿", subText: "Good job resisting." },
    english: { text: "Distraction intercepted! +100 Willpower points 🗿", subText: "Great job maintaining control." },
    auraDelta: 100,
    tone: 'compliment'
  },
  {
    id: 'ar106',
    hinglish: { text: "1 ghante ka focus = 10 ghante ki average padhai 🗿", subText: "Maximize efficiency." },
    english: { text: "1 hour of deep focus beats 10 hours of half-hearted study 🗿", subText: "Maximize ruthless efficiency." },
    auraDelta: 150,
    tone: 'chad'
  },
  {
    id: 'ar107',
    hinglish: { text: "App blocked! Moai has saved you from yourself 🗿", subText: "Thank Moai later." },
    english: { text: "App blocked! Moai has saved you from self-sabotage 🗿", subText: "Thank Moai later." },
    auraDelta: 50,
    tone: 'hilarious'
  },
  {
    id: 'ar108',
    hinglish: { text: "Sigma mindset: Pain of discipline > Pain of regret 🗿", subText: "Hold the line." },
    english: { text: "Sigma Mindset: Suffer the pain of discipline, not regret 🗿", subText: "Hold the line." },
    auraDelta: 200,
    tone: 'chad'
  },
  {
    id: 'ar109',
    hinglish: { text: "Feed band kar! Tu abhi GigaChad banne ki process me hai 🗿", subText: "Keep forging." },
    english: { text: "Close the feed! You are forging GigaChad greatness 🗿", subText: "Keep forging." },
    auraDelta: 250,
    tone: 'chad'
  },
  {
    id: 'ar110',
    hinglish: { text: "Final warning: Back to work or lose streak 🗿", subText: "Focus timer awaits." },
    english: { text: "Final warning: Return to work or surrender your streak 🗿", subText: "Focus timer awaits." },
    auraDelta: -500,
    tone: 'savage'
  }
];

// ─── 2. IN-SESSION PERIODIC MOTIVATION & ROASTS (80 ENTRIES) ─────────────────
export const FOCUS_MID_SESSION_ROASTS_DB: BilingualRoast[] = [
  {
    id: 'mr1',
    hinglish: { text: "Phone chhod! Focus timer chal raha hai 🗿", subText: "Har second count karta hai." },
    english: { text: "Eyes on your work! Focus timer is ticking 🗿", subText: "Every single second counts." },
    auraDelta: 50,
    tone: 'chad'
  },
  {
    id: 'mr2',
    hinglish: { text: "Lock in karle bhai, cutoff clear karni hai 🗿", subText: "Dopamine baad me, success pehle." },
    english: { text: "Lock in! You have goals to crush 🗿", subText: "Dopamine later, victory first." },
    auraDelta: 50,
    tone: 'reality_check'
  },
  {
    id: 'mr3',
    hinglish: { text: "Moai is watching you grind 🗿 Keep going!", subText: "+100 Aura for staying focused." },
    english: { text: "Moai is watching your grind 🗿 Keep pushing!", subText: "+100 Aura for staying locked in." },
    auraDelta: 100,
    tone: 'compliment'
  },
  {
    id: 'mr4',
    hinglish: { text: "Squad streak bachana hai toh screen mat chhu 🗿", subText: "Squad depends on you." },
    english: { text: "Keep hands off the screen to protect the squad streak 🗿", subText: "Your crew depends on you." },
    auraDelta: 50,
    tone: 'hilarious'
  },
  {
    id: 'mr5',
    hinglish: { text: "Adha session complete! Give your 100% 🗿", subText: "Finish strong like a GigaChad." },
    english: { text: "Halfway through the session! Give it your all 🗿", subText: "Finish strong like a true champion." },
    auraDelta: 100,
    tone: 'compliment'
  },
  {
    id: 'mr6',
    hinglish: { text: "Tu kar sakta hai bhai, distract mat ho 🗿", subText: "Pure focus mode active." },
    english: { text: "You have what it takes. Refuse to be distracted 🗿", subText: "Pure focus state engaged." },
    auraDelta: 50,
    tone: 'compliment'
  },
  {
    id: 'mr7',
    hinglish: { text: "Aura growing... +250 Aura in progress 🗿", subText: "Don't break the momentum." },
    english: { text: "Aura surging... +250 Aura in progress 🗿", subText: "Maintain maximum momentum." },
    auraDelta: 250,
    tone: 'compliment'
  },
  {
    id: 'mr8',
    hinglish: { text: "Dopamine demon haar raha hai, tu jeet raha hai 🗿", subText: "Hold the line!" },
    english: { text: "The dopamine demon is collapsing. You are winning 🗿", subText: "Hold the line!" },
    auraDelta: 100,
    tone: 'chad'
  },
  {
    id: 'mr9',
    hinglish: { text: "Competition ko peeche chhodne ka time hai 🗿", subText: "Deep focus session running." },
    english: { text: "This is where you leave your competitors behind 🗿", subText: "Deep work in progress." },
    auraDelta: 50,
    tone: 'chad'
  },
  {
    id: 'mr10',
    hinglish: { text: "Tu distracted hua toh Moai tujhe 2 ghante roast karega 🗿", subText: "Stay focused." },
    english: { text: "If you break focus now, Moai will roast you relentlessly 🗿", subText: "Stay locked in." },
    auraDelta: 50,
    tone: 'savage'
  },
  {
    id: 'mr11',
    hinglish: { text: "Consistency is King 🗿 Keep locking in.", subText: "Streak increment incoming." },
    english: { text: "Consistency is King 🗿 Keep locking in.", subText: "Streak increment incoming." },
    auraDelta: 100,
    tone: 'compliment'
  },
  {
    id: 'mr12',
    hinglish: { text: "Deep work in progress. Distractions eliminated 🗿", subText: "Shield active." },
    english: { text: "Deep work in progress. All distractions eliminated 🗿", subText: "Shield fully active." },
    auraDelta: 50,
    tone: 'chad'
  },
  {
    id: 'mr13',
    hinglish: { text: "Abe notification ki aawaz pe mat ja, kaam kar 🗿", subText: "Ignore all notifications." },
    english: { text: "Ignore the buzzes and pings. Stay on the prize 🗿", subText: "Total focus immunity." },
    auraDelta: 50,
    tone: 'hilarious'
  },
  {
    id: 'mr14',
    hinglish: { text: "Winning mindset: Finish what you started 🗿", subText: "Almost at the finish line." },
    english: { text: "Champion mindset: Finish what you started 🗿", subText: "The finish line is near." },
    auraDelta: 100,
    tone: 'compliment'
  },
  {
    id: 'mr15',
    hinglish: { text: "Your squad is gaining XP right now 🚀", subText: "Don't let them down." },
    english: { text: "Your squad is raking in XP right now 🚀", subText: "Keep up the collective lead." },
    auraDelta: 75,
    tone: 'compliment'
  },
  {
    id: 'mr16',
    hinglish: { text: "Brain getting sharper, dopamine getting balanced 🗿", subText: "Great focus discipline." },
    english: { text: "Brain sharpening, neurochemistry balancing 🗿", subText: "Incredible discipline." },
    auraDelta: 100,
    tone: 'compliment'
  },
  {
    id: 'mr17',
    hinglish: { text: "Sirf aakhri kuch minute bache hain! Give it everything 🗿", subText: "Final push." },
    english: { text: "Final stretch! Give it everything you have 🗿", subText: "Finish with maximum power." },
    auraDelta: 150,
    tone: 'chad'
  },
  {
    id: 'mr18',
    hinglish: { text: "Success is boring daily habits 🗿 You are building it.", subText: "Locked in." },
    english: { text: "Success is built on relentless daily discipline 🗿 You are doing it.", subText: "Locked in." },
    auraDelta: 100,
    tone: 'compliment'
  },
  {
    id: 'mr19',
    hinglish: { text: "Reels dekhne walo se tu 10 kadam aage nikal chuka hai 🗿", subText: "Keep leading." },
    english: { text: "You are miles ahead of mindless scrollers right now 🗿", subText: "Keep leading the pack." },
    auraDelta: 150,
    tone: 'compliment'
  },
  {
    id: 'mr20',
    hinglish: { text: "Moai approves your grind today 🗿", subText: "+300 Aura bonus pending." },
    english: { text: "Moai approves your relentless grind today 🗿", subText: "+300 Aura bonus pending." },
    auraDelta: 300,
    tone: 'compliment'
  },
  {
    id: 'mr21',
    hinglish: { text: "Look at you locking in like a true Sigma 🗿", subText: "Distraction level: ZERO." },
    english: { text: "Look at you locking in like an absolute legend 🗿", subText: "Distraction level: ZERO." },
    auraDelta: 120,
    tone: 'compliment'
  },
  {
    id: 'mr22',
    hinglish: { text: "Tu rukna mat, flow state me aa chuka hai tu 🗿", subText: "Ride the focus wave." },
    english: { text: "Do not stop now. You have entered deep flow 🗿", subText: "Ride the focus wave." },
    auraDelta: 150,
    tone: 'compliment'
  },
  {
    id: 'mr23',
    hinglish: { text: "Jo mehnat karega wahi aage badhega 🗿", subText: "Every focused minute counts." },
    english: { text: "Those who endure the work inherit the reward 🗿", subText: "Every focused minute counts." },
    auraDelta: 80,
    tone: 'chad'
  },
  {
    id: 'mr24',
    hinglish: { text: "Dopamine detox mode: Peak Mental Clarity 🗿", subText: "Brain fog dissolving." },
    english: { text: "Dopamine detox mode: Peak Mental Clarity 🗿", subText: "Brain fog is clearing." },
    auraDelta: 100,
    tone: 'compliment'
  },
  {
    id: 'mr25',
    hinglish: { text: "Your willpower is turning into steel 🗿", subText: "Keep going." },
    english: { text: "Your willpower is turning into solid steel 🗿", subText: "Keep going." },
    auraDelta: 100,
    tone: 'compliment'
  },
  {
    id: 'mr26',
    hinglish: { text: "Moai stone energy is powering your focus 🗿", subText: "Unstoppable momentum." },
    english: { text: "Moai stone energy is fueling your focus 🗿", subText: "Unstoppable momentum." },
    auraDelta: 150,
    tone: 'chad'
  },
  {
    id: 'mr27',
    hinglish: { text: "Ye time dubara nahi milega, poora utililse kar 🗿", subText: "Seize the day." },
    english: { text: "You won't get this hour back. Make it count 🗿", subText: "Seize the moment." },
    auraDelta: 90,
    tone: 'reality_check'
  },
  {
    id: 'mr28',
    hinglish: { text: "Focus streak status: Diamond Grade 💎", subText: "Keep locking in." },
    english: { text: "Focus streak status: Diamond Grade 💎", subText: "Keep locking in." },
    auraDelta: 200,
    tone: 'compliment'
  },
  {
    id: 'mr29',
    hinglish: { text: "Average log phone check kar rahe hain, tu grind kar raha hai 🗿", subText: "Be exceptional." },
    english: { text: "Average people are checking notifications. You are building 🗿", subText: "Be exceptional." },
    auraDelta: 120,
    tone: 'chad'
  },
  {
    id: 'mr30',
    hinglish: { text: "GigaChad focus active. Noise reduced to 0 🗿", subText: "Pure execution." },
    english: { text: "GigaChad focus active. All noise reduced to zero 🗿", subText: "Pure execution." },
    auraDelta: 150,
    tone: 'chad'
  }
];

// ─── 3. IDLE / DOOMSCROLLING NUDGE ROASTS (50 ENTRIES) ────────────────────────
export const IDLE_DOOMSCROLL_ROASTS_DB: BilingualRoast[] = [
  {
    id: 'ir1',
    hinglish: { text: "Kitna scroll karega bhai? Aaj ka goal bhool gaya? 🗿", subText: "App khol aur focus session start kar." },
    english: { text: "Still scrolling mindlessly? Did you forget today's goal? 🗿", subText: "Open Scrolln't and start a focus session." },
    auraDelta: -50,
    tone: 'savage'
  },
  {
    id: 'ir2',
    hinglish: { text: "Streak khatre me hai! 2 ghante se koi focus session nahi hua 🗿", subText: "Lock in before midnight." },
    english: { text: "Streak at risk! No focus sessions logged recently 🗿", subText: "Lock in before midnight arrives." },
    auraDelta: -100,
    tone: 'reality_check'
  },
  {
    id: 'ir3',
    hinglish: { text: "Moai noticed your screen time is spiking 🗿", subText: "Stop the brainrot. Lock In now." },
    english: { text: "Moai noticed your screen time is skyrocketing 🗿", subText: "Halt the brainrot. Lock In now." },
    auraDelta: -75,
    tone: 'savage'
  },
  {
    id: 'ir4',
    hinglish: { text: "Squad members are waiting for your XP contribution 🚀", subText: "Start a focus timer to keep the lead." },
    english: {
      text: "Your squad is waiting for your XP contribution 🚀",
      subText: "Start a focus timer to protect the lead."
    },
    auraDelta: 0,
    tone: 'chad'
  },
  {
    id: 'ir5',
    hinglish: { text: "Phone chhodne ka mann nahi kar raha? Moai will help you 🗿", subText: "Tap to shield all distracting apps." },
    english: { text: "Struggling to put the phone down? Moai is here 🗿", subText: "Tap to activate shield on all distraction apps." },
    auraDelta: 0,
    tone: 'chad'
  },
  {
    id: 'ir6',
    hinglish: { text: "Dopamine debt incoming! Start your session 🗿", subText: "Reclaim your mind." },
    english: { text: "Dopamine debt piling up! Start your focus session 🗿", subText: "Reclaim your mind right now." },
    auraDelta: -50,
    tone: 'reality_check'
  },
  {
    id: 'ir7',
    hinglish: { text: "Abhi nahi toh kab? 30 minute ka deep focus session start kar 🗿", subText: "Lock In now." },
    english: { text: "If not now, when? Launch a 30-minute deep focus session 🗿", subText: "Lock In now." },
    auraDelta: 0,
    tone: 'chad'
  },
  {
    id: 'ir8',
    hinglish: { text: "Your daily focus streak is ticking away ⌛", subText: "Complete 1 session to stay on top." },
    english: { text: "Your daily focus streak is ticking away ⌛", subText: "Complete 1 session to stay on top." },
    auraDelta: 0,
    tone: 'reality_check'
  },
  {
    id: 'ir9',
    hinglish: { text: "Moai is waiting on your home screen 🗿 Time to Lock In.", subText: "Shield active." },
    english: { text: "Moai is waiting on your screen 🗿 Time to Lock In.", subText: "Shield active." },
    auraDelta: 0,
    tone: 'chad'
  },
  {
    id: 'ir10',
    hinglish: { text: "Berozgari se bachna hai toh tap kar aur padhna shuru kar 🗿", subText: "Focus session." },
    english: { text: "If you want real success, tap in and start studying 🗿", subText: "Focus session awaits." },
    auraDelta: -100,
    tone: 'savage'
  }
];

// ─── 4. SESSION VICTORY COMPLIMENTS (30 ENTRIES) ─────────────────────────────
export const SESSION_VICTORY_ROASTS_DB: BilingualRoast[] = [
  {
    id: 'vr1',
    hinglish: { text: "GigaChad Session Complete! +500 Aura 🗿", subText: "Tu sach me serious hai apne goals ke liye." },
    english: { text: "GigaChad Session Complete! +500 Aura 🗿", subText: "You are undeniably serious about your greatness." },
    auraDelta: 500,
    tone: 'compliment'
  },
  {
    id: 'vr2',
    hinglish: { text: "Dopamine Demon Cooked! Streak Safe 🔥", subText: "Another victory against brainrot." },
    english: { text: "Dopamine Demon Demolished! Streak Safe 🔥", subText: "Another decisive victory over brainrot." },
    auraDelta: 350,
    tone: 'compliment'
  },
  {
    id: 'vr3',
    hinglish: { text: "Chalo thoda aura recover ho gaya (+1000 Aura) 🗿", subText: "Squad ranks me upar jaa raha hai tu." },
    english: { text: "Aura restored (+1,000 Aura)! 🗿", subText: "Climbing rapidly up the squad leaderboard." },
    auraDelta: 1000,
    tone: 'compliment'
  },
  {
    id: 'vr4',
    hinglish: { text: "Aise hi roz padhega toh Ambani ban jayega 🗿", subText: "Clean 100% focus score." },
    english: { text: "Maintain this daily discipline and nothing can stop you 🗿", subText: "Flawless 100% focus score." },
    auraDelta: 400,
    tone: 'compliment'
  },
  {
    id: 'vr5',
    hinglish: { text: "Sigma Grindset Level Up! 🚀", subText: "Streak maintained like a king." },
    english: { text: "Sigma Grindset Level Up! 🚀", subText: "Streak maintained like true royalty." },
    auraDelta: 500,
    tone: 'compliment'
  },
  {
    id: 'vr6',
    hinglish: { text: "Moai gives you GigaChad approval 🗿", subText: "Proud of your discipline today." },
    english: { text: "Moai bestows GigaChad approval upon you 🗿", subText: "Incredibly proud of your discipline today." },
    auraDelta: 600,
    tone: 'compliment'
  },
  {
    id: 'vr7',
    hinglish: { text: "Flawless Victory! +250 XP earned 🗿", subText: "Keep stacking wins." },
    english: { text: "Flawless Victory! +250 XP earned 🗿", subText: "Keep stacking these daily wins." },
    auraDelta: 250,
    tone: 'compliment'
  },
  {
    id: 'vr8',
    hinglish: { text: "You did what 99% of people couldn't today 🗿", subText: "True focus champion." },
    english: { text: "You did what 99% of people failed to do today 🗿", subText: "A true master of focus." },
    auraDelta: 400,
    tone: 'compliment'
  }
];

// ─── 5. SESSION FAILED / QUIT ROASTS (20 ENTRIES) ────────────────────────────
export const SESSION_FAILED_ROASTS_DB: BilingualRoast[] = [
  {
    id: 'fr1',
    hinglish: { text: "L lag gaye... Streak toot gayi 💀", subText: "Willpower 0. Moai is crying inside." },
    english: { text: "You folded... Streak broken 💀", subText: "Willpower: Zero. Moai is grieving inside." },
    auraDelta: -500,
    tone: 'savage'
  },
  {
    id: 'fr2',
    hinglish: { text: "Pata tha tujhse na ho payega 🤡", subText: "10 minute bhi focus nahi tik paaya?" },
    english: { text: "Knew you couldn't handle it 🤡", subText: "Couldn't even sustain focus for 10 minutes?" },
    auraDelta: -600,
    tone: 'savage'
  },
  {
    id: 'fr3',
    hinglish: { text: "Aura reset to -999,999! Clown moment 🗿", subText: "Ab kal wapas se zero se shuru kar." },
    english: { text: "Aura collapsed to -999,999! Clown moment 🗿", subText: "Start from absolute zero tomorrow." },
    auraDelta: -999,
    tone: 'savage'
  },
  {
    id: 'fr4',
    hinglish: { text: "Dopamine jeet gaya, tu haar gaya 💀", subText: "Reels ne tera career khaa liya." },
    english: { text: "Dopamine won, you surrendered 💀", subText: "Brainrot claimed another victim." },
    auraDelta: -700,
    tone: 'reality_check'
  }
];

// ─── HELPER ACCESSORS ────────────────────────────────────────────────────────

/**
 * Get random roast for a specific category and language
 */
export function getRandomRoast(
  type: 'attempt' | 'mid_session' | 'idle' | 'victory' | 'failed' = 'attempt',
  lang: RoastLanguage = 'hinglish'
): Roast {
  const pool =
    type === 'attempt'
      ? APP_ATTEMPT_ROASTS_DB
      : type === 'mid_session'
      ? FOCUS_MID_SESSION_ROASTS_DB
      : type === 'idle'
      ? IDLE_DOOMSCROLL_ROASTS_DB
      : type === 'victory'
      ? SESSION_VICTORY_ROASTS_DB
      : SESSION_FAILED_ROASTS_DB

  const item = pool[Math.floor(Math.random() * pool.length)] || APP_ATTEMPT_ROASTS_DB[0]
  const content = lang === 'english' ? item.english : item.hinglish

  return {
    id: item.id,
    text: content.text,
    subText: content.subText,
    auraDelta: item.auraDelta,
    tone: item.tone
  }
}

/**
 * Get notification title and body formatted for user's language preference
 */
export function getNotificationRoast(
  attemptedAppName?: string,
  lang: RoastLanguage = 'hinglish',
  type: 'attempt' | 'mid_session' | 'idle' | 'victory' | 'failed' = 'attempt'
): { title: string; body: string } {
  const roast = getRandomRoast(type, lang)

  let title = ''
  if (type === 'attempt') {
    if (lang === 'english') {
      title = attemptedAppName ? `🗿 Close ${attemptedAppName} Now!` : `🗿 Focus Session Alert!`
    } else {
      title = attemptedAppName ? `🗿 ${attemptedAppName} Band Kar Bhai!` : `🗿 Focus Session Alert!`
    }
  } else if (type === 'victory') {
    title = lang === 'english' ? '🏆 Session Conquered! GigaChad!' : '🏆 Session Conquered! +500 Aura!'
  } else if (type === 'idle') {
    title = lang === 'english' ? '🗿 Doomscroll Alert — Lock In!' : '🗿 Scroll Band Kar — Lock In!'
  } else if (type === 'failed') {
    title = lang === 'english' ? '💀 Focus Failed — Streak Lost!' : '💀 Focus Failed — Streak Gayi!'
  } else {
    title = lang === 'english' ? '🗿 Focus Check — Stay Locked In' : '🗿 Focus Alert — Dhyan De!'
  }

  return {
    title,
    body: roast.text + (roast.subText ? ' ' + roast.subText : '')
  }
}

// Backward compatibility aliases
export const APP_ATTEMPT_ROASTS = APP_ATTEMPT_ROASTS_DB.map(r => ({
  id: r.id,
  text: r.hinglish.text,
  subText: r.hinglish.subText,
  auraDelta: r.auraDelta,
  tone: r.tone
}))

export const FOCUS_MID_SESSION_ROASTS = FOCUS_MID_SESSION_ROASTS_DB.map(r => ({
  id: r.id,
  text: r.hinglish.text,
  subText: r.hinglish.subText,
  auraDelta: r.auraDelta,
  tone: r.tone
}))

export const SESSION_VICTORY_ROASTS = SESSION_VICTORY_ROASTS_DB.map(r => ({
  id: r.id,
  text: r.hinglish.text,
  subText: r.hinglish.subText,
  auraDelta: r.auraDelta,
  tone: r.tone
}))

export const SESSION_FAILED_ROASTS = SESSION_FAILED_ROASTS_DB.map(r => ({
  id: r.id,
  text: r.hinglish.text,
  subText: r.hinglish.subText,
  auraDelta: r.auraDelta,
  tone: r.tone
}))
