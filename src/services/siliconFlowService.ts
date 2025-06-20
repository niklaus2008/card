import { SiliconFlowRequest, SiliconFlowResponse, CardTheme } from '@/types';

/**
 * 金句数据接口
 * @interface QuoteData
 */
interface QuoteData {
  /** 金句内容和出处 */
  content: string;
  /** 金句解释 */
  explanation: string;
}

/**
 * 硅基流动API服务类
 * @class SiliconFlowService
 */
class SiliconFlowService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_SILICONFLOW_API_KEY || '';
    this.baseUrl = import.meta.env.VITE_SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1';
  }

  /**
   * 默认金句库 - 当AI生成失败时使用
   * @private
   */
  private defaultQuotes = {
    [CardTheme.INSPIRATIONAL]: [
      {
        content: '生命不息，奋斗不止 — 电影《阿甘正传》',
        explanation: '改编自核心精神，原台词为"Life is like a box of chocolates"。通过时间维度的拆解，强调把握当下的哲学内核，符合"智慧格言"要求。'
      },
      {
        content: '今天的努力，是为了明天的自己 — 稻盛和夫',
        explanation: '日本经营之圣稻盛和夫的人生哲学。强调当下行动与未来成果的因果关系，体现了东方智慧中"种瓜得瓜"的朴素道理。'
      },
      {
        content: '不是因为有希望才坚持，而是坚持了才有希望 — 村上春树',
        explanation: '日本作家村上春树的人生感悟。颠覆了传统的因果逻辑，强调行动的主动性，体现了现代人面对不确定性时的积极态度。'
      },
      {
        content: '成功不是终点，失败也不是末日 — 丘吉尔',
        explanation: '英国首相丘吉尔在二战期间的名言。用对比的修辞手法，阐述了成败的相对性，体现了政治家面对危机时的坚韧品格。'
      },
      {
        content: '你的努力，时间都看得见 — 电影《当幸福来敲门》',
        explanation: '改编自电影核心主题。将抽象的"时间"拟人化，强调努力的累积效应，体现了美国梦中"天道酬勤"的价值观念。'
      },
      {
        content: '每一个不曾起舞的日子，都是对生命的辜负 — 尼采',
        explanation: '德国哲学家尼采的生命哲学。用"起舞"比喻生命的活力与激情，体现了存在主义哲学中"活出真我"的核心理念。'
      },
      {
        content: '山重水复疑无路，柳暗花明又一村 — 陆游《游山西村》',
        explanation: '南宋诗人陆游的千古名句。通过山水景色的变化，比喻人生困境与转机，体现了中国古典诗歌中"情景交融"的艺术手法。'
      },
      {
        content: '路虽远行则将至，事虽难做则必成 — 《荀子》',
        explanation: '先秦思想家荀子的励志名言。采用排比句式，强调行动的重要性，体现了儒家文化中"知行合一"的实践精神。'
      },
      {
        content: '生于忧患，死于安乐 — 孟子',
        explanation: '战国时期思想家孟子的警世名言。通过对比"忧患"与"安乐"，阐述了逆境对人格塑造的重要作用，体现了儒家文化中"天将降大任于斯人也"的人才观念。'
      }
    ],
    [CardTheme.PHILOSOPHICAL]: [
      {
        content: '人生如逆旅，我亦是行人 — 苏轼《临江仙》',
        explanation: '北宋文豪苏轼的人生感悟。将人生比作逆旅，自己比作行人，体现了古代文人面对人生无常时的达观态度和哲学思考。'
      },
      {
        content: '存在即合理 — 黑格尔',
        explanation: '德国哲学家黑格尔的著名论断。强调现实存在的必然性，体现了辩证法中"现实性与合理性统一"的深刻哲理。'
      },
      {
        content: '我思故我在 — 笛卡尔',
        explanation: '法国哲学家笛卡尔的哲学基石。通过怀疑一切来寻找不可怀疑的真理，确立了理性主义哲学的根本出发点。'
      },
      {
        content: '人不能两次踏进同一条河流 — 赫拉克利特',
        explanation: '古希腊哲学家赫拉克利特的变化哲学。用河流比喻世界的永恒变化，体现了古希腊哲学中"万物皆流"的辩证思想。'
      },
      {
        content: '知之为知之，不知为不知，是知也 — 《论语》',
        explanation: '孔子关于求知态度的教导。强调诚实面对知识的边界，体现了儒家文化中"实事求是"的学术精神和谦逊品格。'
      },
      {
        content: '生活不是等待暴风雨过去，而是学会在雨中跳舞 — 电影《闻香识女人》',
        explanation: '电影中的经典台词。用暴风雨和跳舞的对比，阐述了积极面对困难的人生态度，体现了西方文化中的乐观主义精神。'
      },
      {
        content: '一花一世界，一叶一菩提 — 《华严经》',
        explanation: '佛教经典中的禅理名句。通过花叶的微观世界，阐述了佛法中"小中见大"的智慧，体现了东方宗教哲学的深邃思考。'
      },
      {
        content: '人生天地间，若白驹过隙，忽然而已 — 《庄子》',
        explanation: '道家思想家庄子对时间的感悟。用白马过隙比喻时光飞逝，体现了道家哲学中对生命短暂性的深刻认知。'
      }
    ],
    [CardTheme.EMOTIONAL]: [
      {
        content: '爱是恒久忍耐，又有恩慈 — 《圣经·哥林多前书》',
        explanation: '基督教经典中对爱的定义。强调爱的持久性和包容性，体现了宗教文化中对真爱品质的深刻理解和崇高追求。'
      },
      {
        content: '山无陵，江水为竭，冬雷震震，夏雨雪 — 《上邪》',
        explanation: '汉乐府民歌中的爱情誓言。用极端的自然现象比喻爱情的坚贞，体现了中国古代民间文学中炽热真挚的情感表达。'
      },
      {
        content: '我爱你，不是因为你是谁，而是因为我喜欢与你在一起时的感觉 — 电影《廊桥遗梦》',
        explanation: '经典爱情电影中的深情告白。强调爱情中的感受体验胜过外在条件，体现了现代爱情观中对心灵契合的重视。'
      },
      {
        content: '此情可待成追忆，只是当时已惘然 — 李商隐《锦瑟》',
        explanation: '晚唐诗人李商隐的情感名句。通过时间的对比，表达对逝去美好的怀念，体现了中国古典诗歌中含蓄深沉的情感美学。'
      },
      {
        content: '最好的爱情，是两个人彼此做个伴 — 电影《一生一世》',
        explanation: '现代爱情电影中的朴实告白。强调陪伴胜过激情，体现了当代人对爱情本质的成熟理解和平实追求。'
      },
      {
        content: '愿得一心人，白头不相离 — 卓文君《白头吟》',
        explanation: '汉代才女卓文君的爱情宣言。表达对专一爱情的渴望，体现了中国传统文化中对忠贞爱情的美好向往。'
      },
      {
        content: '真正的爱情是不求回报的 — 电影《泰坦尼克号》',
        explanation: '经典爱情电影中的深刻感悟。强调爱的无私性，体现了西方浪漫主义文化中对纯粹爱情的理想化追求。'
      },
      {
        content: '情不知所起，一往而深 — 汤显祖《牡丹亭》',
        explanation: '明代戏曲家汤显祖的爱情哲理。描述爱情的突然降临和深入发展，体现了中国古典文学中对情感力量的深刻认知。'
      }
    ],
    [CardTheme.LIFE]: [
      {
        content: '生活就像一盒巧克力，你永远不知道下一块是什么味道 — 电影《阿甘正传》',
        explanation: '经典电影中的人生比喻。用巧克力的未知味道比喻生活的不确定性，体现了美国文化中对生活多样性的乐观接受。'
      },
      {
        content: '平凡的日子里，也有微小的美好 — 村上春树',
        explanation: '日本作家村上春树的生活哲学。强调在平淡中发现美好，体现了现代都市文学中对日常生活诗意的敏感捕捉。'
      },
      {
        content: '慢慢来，一切都来得及 — 台湾电影《不能说的秘密》',
        explanation: '台湾电影中的温暖台词。强调从容面对生活节奏，体现了华语文化中对"慢生活"理念的温柔表达。'
      },
      {
        content: '生活不只眼前的苟且，还有诗和远方 — 许巍《生活不止眼前的苟且》',
        explanation: '音乐人许巍的生活感悟。对比现实与理想，体现了当代文艺青年对精神追求的坚持和对美好生活的向往。'
      },
      {
        content: '小确幸就是生活中微小但确切的幸福 — 村上春树',
        explanation: '村上春树创造的生活概念。强调微小幸福的真实性，体现了现代人在快节奏生活中对简单快乐的珍视。'
      },
      {
        content: '岁月不居，时节如流 — 《论盛孝章书》',
        explanation: '东汉文学家孔融的时光感悟。用流水比喻时间流逝，体现了中国古典文学中对时光易逝的深刻感知。'
      },
      {
        content: '人间烟火气，最抚凡人心 — 电影《小森林》',
        explanation: '日式生活电影中的温暖表达。强调日常生活的治愈力量，体现了东亚文化中对平凡生活美学的深度挖掘。'
      },
      {
        content: '生活需要仪式感，平凡的日子需要一束光 — 综艺《向往的生活》',
        explanation: '生活类综艺节目中的生活理念。强调在平淡中创造特别，体现了现代人对生活品质和精神愉悦的双重追求。'
      }
    ],
    [CardTheme.WISDOM]: [
      {
        content: '学而时习之，不亦说乎 — 《论语》',
        explanation: '孔子关于学习的经典论述。强调学习与实践的结合，体现了儒家教育思想中"知行合一"的核心理念。'
      },
      {
        content: '知者不惑，仁者不忧，勇者不惧 — 《论语》',
        explanation: '孔子对理想人格的三重境界描述。分别从智慧、品德、勇气三个维度，构建了儒家文化中的完美人格标准。'
      },
      {
        content: '上善若水，水善利万物而不争 — 《道德经》',
        explanation: '老子的道德哲学核心观点。以水的品性比喻最高的善，体现了道家思想中"柔弱胜刚强"的辩证智慧。'
      },
      {
        content: '博学之，审问之，慎思之，明辨之，笃行之 — 《中庸》',
        explanation: '儒家经典中的学习方法论。提出学习的五个递进步骤，体现了中国古代教育思想的系统性和实践性。'
      },
      {
        content: '己所不欲，勿施于人 — 《论语》',
        explanation: '孔子的道德金律。强调换位思考的重要性，体现了儒家文化中"仁爱"思想的核心要义和普世价值。'
      },
      {
        content: '路漫漫其修远兮，吾将上下而求索 — 屈原《离骚》',
        explanation: '战国诗人屈原的人生誓言。表达对真理的执着追求，体现了中国古代知识分子的担当精神和理想主义情怀。'
      },
      {
        content: '三人行，必有我师焉 — 《论语》',
        explanation: '孔子关于学习态度的教导。强调向他人学习的重要性，体现了儒家文化中谦逊好学的品格和开放包容的心态。'
      },
      {
        content: '天行健，君子以自强不息 — 《周易》',
        explanation: '《易经》中的人生哲理。以天道运行比喻人生态度，体现了中华文化中积极进取、永不放弃的精神品格。'
      }
    ]
  };

  /**
   * 检查API配置是否有效
   * @returns {boolean} 配置是否有效
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * 获取默认金句（当AI生成失败时使用）
   * @param {CardTheme} theme - 金句主题
   * @returns {QuoteData} 默认金句数据
   * @private
   */
  private getDefaultQuote(theme: CardTheme): QuoteData {
    const quotes = this.defaultQuotes[theme];
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  /**
   * 根据金句内容获取解释
   * @param {string} content - 金句内容
   * @returns {Promise<string | null>} 金句解释，如果找不到则返回null
   */
  async getQuoteExplanation(content: string): Promise<string | null> {
    // 遍历所有主题的金句，查找匹配的内容
    for (const theme of Object.values(CardTheme)) {
      const quotes = this.defaultQuotes[theme];
      
      // 精确匹配
      let matchedQuote = quotes.find(quote => quote.content === content);
      
      // 如果精确匹配失败，尝试包含匹配
      if (!matchedQuote) {
        matchedQuote = quotes.find(quote => 
          quote.content.includes(content) || content.includes(quote.content)
        );
      }
      
      // 如果还是没有匹配，尝试去掉标点符号和空格后匹配
      if (!matchedQuote) {
        const cleanContent = content.replace(/[^\w\u4e00-\u9fa5]/g, '');
        matchedQuote = quotes.find(quote => {
          const cleanQuote = quote.content.replace(/[^\w\u4e00-\u9fa5]/g, '');
          return cleanQuote.includes(cleanContent) || cleanContent.includes(cleanQuote);
        });
      }
      
      if (matchedQuote) {
        return matchedQuote.explanation;
      }
    }
    
    // 如果在默认金句库中没有找到，尝试生成AI解释
    return await this.generateQuoteExplanation(content);
  }

  /**
   * 为用户自定义金句生成AI解释
   * @param {string} content - 金句内容
   * @returns {Promise<string | null>} 生成的解释，失败时返回null
   * @private
   */
  private async generateQuoteExplanation(content: string): Promise<string | null> {
    try {
      const prompt = `请为这句金句提供深入的解释和分析："${content}"

要求：
1. 分析金句的含义和哲理
2. 解释其价值和启发意义
3. 如果能识别出处，请简要介绍背景
4. 控制在100-200字之间
5. 语言要通俗易懂，富有启发性

请直接输出解释内容，不要包含"这句话"、"金句解释"等前缀。`;

      const requestData: SiliconFlowRequest = {
        model: 'Qwen/Qwen2.5-7B-Instruct',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      };

      const explanation = await this.makeApiRequest(requestData);
      
      // 清理可能的前缀和后缀
      let cleanedExplanation = explanation
        .replace(/^(金句解释[：:]?|解释[：:]?|分析[：:]?)/i, '')
        .replace(/^["']|["']$/g, '')
        .trim();
      
      // 如果解释太短或包含无意义内容，返回null
      if (cleanedExplanation.length < 20 || 
          /^(抱歉|无法|不能|没有|未知)/.test(cleanedExplanation)) {
        return null;
      }
      
      return cleanedExplanation;
    } catch (error) {
      console.error('AI生成金句解释失败:', error);
      return null;
    }
  }

  /**
   * 检测文本是否包含中文
   * @param {string} text - 要检测的文本
   * @returns {boolean} 是否包含中文
   * @private
   */
  private isChinese(text: string): boolean {
    // 只要包含任何一个中文字符，就认为是中文文本
    const chineseRegex = /[\u4e00-\u9fa5]/;
    return chineseRegex.test(text);
  }

  /**
   * 生成指定主题的金句
   * @param {CardTheme} theme - 金句主题，默认为励志类
   * @returns {Promise<string>} 生成的金句内容
   */
  async generateQuote(theme: CardTheme = CardTheme.INSPIRATIONAL): Promise<string> {
    try {
      const prompts = {
        [CardTheme.INSPIRATIONAL]: '请生成一句励志名言或金句，要求简洁有力，能够激励人心。请直接输出具体的金句和真实出处，用"—"分隔。必须使用中文。',
        [CardTheme.PHILOSOPHICAL]: '请生成一句哲理名言或智慧语录，要求有深度，能够引发思考。请直接输出具体的金句和真实出处，用"—"分隔。必须使用中文。',
        [CardTheme.EMOTIONAL]: '请生成一句温暖治愈的情感金句，要求能够打动人心，传递正能量。请直接输出具体的金句和真实出处，用"—"分隔。必须使用中文。',
        [CardTheme.LIFE]: '请生成一句关于生活的智慧语录，要求贴近日常，有实用价值。请直接输出具体的金句和真实出处，用"—"分隔。必须使用中文。',
        [CardTheme.WISDOM]: '请生成一句古今中外的智慧名言，要求经典深刻，有教育意义。请直接输出具体的金句和真实出处，用"—"分隔。必须使用中文。'
      };

      const requestData: SiliconFlowRequest = {
        model: 'Qwen/Qwen2.5-7B-Instruct',
        messages: [
          {
            role: 'user',
            content: prompts[theme]
          }
        ],
        max_tokens: 150,
        temperature: 0.8
      };

      // 最多重试3次，确保生成中文金句
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          const result = await this.makeApiRequest(requestData);
          
          // 解析金句内容
          const { quote } = this.parseQuoteAndSource(result);
          
          // 检测是否为中文
          if (this.isChinese(quote)) {
            console.log(`✅ 成功生成中文金句 (第${attempts + 1}次尝试):`, quote);
            return result;
          } else {
            console.log(`⚠️ 检测到非中文金句 (第${attempts + 1}次尝试):`, quote);
            attempts++;
            
            // 如果不是最后一次尝试，修改提示词增强中文要求
            if (attempts < maxAttempts) {
              requestData.messages[0].content = prompts[theme] + ` 注意：必须生成中文金句，不能使用英文或其他语言。`;
              // 稍微增加随机性，确保temperature存在
              if (requestData.temperature !== undefined) {
                requestData.temperature = Math.min(0.9, requestData.temperature + 0.1);
              }
            }
          }
        } catch (error) {
          console.error(`第${attempts + 1}次生成金句失败:`, error);
          attempts++;
        }
      }
      
      // 如果3次都失败，使用默认中文金句
      console.log('🔄 AI生成失败或非中文，使用默认中文金句');
      const defaultQuote = this.getDefaultQuote(theme);
      return defaultQuote.content;
      
    } catch (error) {
      console.error('AI生成金句失败，使用默认金句:', error);
      // AI生成失败时，返回默认金句
      const defaultQuote = this.getDefaultQuote(theme);
      return defaultQuote.content;
    }
  }

  /**
   * 随机生成金句（随机选择主题）
   * @returns {Promise<{content: string, theme: CardTheme}>} 生成的金句和主题
   */
  async generateRandomQuote(): Promise<{content: string, theme: CardTheme}> {
    const themes = Object.values(CardTheme);
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    
    const content = await this.generateQuote(randomTheme);
    
    return {
      content,
      theme: randomTheme
    };
  }

  /**
   * 解析AI生成的内容，分离金句和出处
   * @param {string} aiContent - AI生成的完整内容
   * @returns {{quote: string, source: string}} 分离后的金句和出处
   */
  parseQuoteAndSource(aiContent: string): {quote: string, source: string} {
    // 先清理所有括号内的"注"开头的内容
    let cleanedContent = this.removeNoteText(aiContent);
    
    // 过滤掉可能包含的格式说明文字
    cleanedContent = this.removeFormatInstructions(cleanedContent);
    
    // 查找 "—" 符号分割金句和出处
    const dashIndex = cleanedContent.lastIndexOf('—');
    
    if (dashIndex !== -1) {
      const quote = cleanedContent.substring(0, dashIndex).trim();
      let source = cleanedContent.substring(dashIndex + 1).trim();
      
      // 清理来源部分的前缀符号和多余空格
      source = source
        .replace(/^[—\-\s]+/, '')  // 移除开头的破折号和空格
        .replace(/^["'「『《]/, '')  // 移除开头的引号
        .replace(/["'」』》]$/, '')  // 移除结尾的引号
        .trim();
      
      // 如果来源为空，使用默认来源
      if (!source) {
        source = '智慧语录';
      }
      
      return { quote, source };
    }
    
    // 如果没有找到分隔符，返回默认格式
    return {
      quote: cleanedContent,
      source: '智慧语录'
    };
  }

  /**
   * 移除文本中所有括号内的说明性内容
   * @param {string} text - 原始文本
   * @returns {string} 清理后的文本
   * @private
   */
  private removeNoteText(text: string): string {
    // 匹配所有类型的括号内的说明性内容
    // 支持：注、解析、说明、备注、提示、补充等开头的内容
    const notePatterns = [
      // 中文圆括号
      /（(?:注|解析|说明|备注|提示|补充|附注|详解|释义|注释)[：:][^）]*）/g,
      // 英文圆括号  
      /\((?:注|解析|说明|备注|提示|补充|附注|详解|释义|注释)[：:][^)]*\)/g,
      // 中文方括号
      /【(?:注|解析|说明|备注|提示|补充|附注|详解|释义|注释)[：:][^】]*】/g,
      // 英文方括号
      /\[(?:注|解析|说明|备注|提示|补充|附注|详解|释义|注释)[：:][^\]]*\]/g,
      // 中文六角括号
      /〔(?:注|解析|说明|备注|提示|补充|附注|详解|释义|注释)[：:][^〕]*〕/g,
      // 中文尖括号
      /〈(?:注|解析|说明|备注|提示|补充|附注|详解|释义|注释)[：:][^〉]*〉/g
    ];
    
    let cleanedText = text;
    
    // 逐个应用清理规则
    notePatterns.forEach(pattern => {
      cleanedText = cleanedText.replace(pattern, '');
    });
    
    // 注意：不要在这里移除破折号分隔符，因为parseQuoteAndSource方法需要它来分离金句和来源
    
    // 清理多余的空格和标点
    cleanedText = cleanedText
      .replace(/\s+/g, ' ')     // 多个空格合并为一个
      .replace(/\s*([。，、；：！？])\s*/g, '$1')  // 清理标点符号周围的空格
      .trim();
    
    // 修复双引号匹配问题
    cleanedText = this.fixQuoteMatching(cleanedText);
    
    return cleanedText;
  }

  /**
   * 修复双引号匹配问题
   * @param {string} text - 需要修复的文本
   * @returns {string} 修复后的文本
   * @private
   */
  private fixQuoteMatching(text: string): string {
    // 统计各种引号的数量
    const leftDoubleQuotes = (text.match(/"/g) || []).length;  // 左双引号
    const rightDoubleQuotes = (text.match(/"/g) || []).length; // 右双引号
    const straightQuotes = (text.match(/"/g) || []).length;    // 直引号
    
    // 如果文本中没有任何引号，直接返回，不添加引号
    if (leftDoubleQuotes === 0 && rightDoubleQuotes === 0 && straightQuotes === 0) {
      return text;
    }
    
    // 如果有不匹配的弯引号，尝试修复
    if (leftDoubleQuotes !== rightDoubleQuotes) {
      // 如果只有右引号，没有左引号，在开头添加左引号
      if (leftDoubleQuotes === 0 && rightDoubleQuotes > 0) {
        text = '"' + text;
      }
      // 如果只有左引号，没有右引号，在结尾添加右引号
      else if (leftDoubleQuotes > 0 && rightDoubleQuotes === 0) {
        text = text + '"';
      }
      // 如果左右引号数量不匹配，统一使用直引号
      else if (Math.abs(leftDoubleQuotes - rightDoubleQuotes) > 0) {
        text = text.replace(/[""]/g, '"');
      }
    }
    
    // 处理直引号的配对问题（只在有直引号的情况下）
    if (straightQuotes > 0) {
      // 如果直引号数量是奇数，说明不配对
      if (straightQuotes % 2 === 1) {
        // 检查是否以引号开头但没有结尾引号
        if (text.startsWith('"') && !text.endsWith('"')) {
          text = text + '"';
        }
        // 检查是否以引号结尾但没有开头引号
        else if (text.endsWith('"') && !text.startsWith('"')) {
          text = '"' + text;
        }
      }
    }
    
    return text;
  }

  /**
   * 移除格式说明文字
   * @param {string} text - 原始文本
   * @returns {string} 清理后的文本
   * @private
   */
  private removeFormatInstructions(text: string): string {
    // 移除可能包含的格式说明
    const formatPatterns = [
      /金句内容\s*[—\-]\s*出处/gi,
      /格式为[：:][^。]*。?/gi,
      /请直接输出[^。]*。?/gi,
      /要求[：:][^。]*。?/gi,
      /示例[：:][^。]*。?/gi,
      /例如[：:][^。]*。?/gi,
      /格式[：:][^。]*。?/gi
    ];
    
    let cleanedText = text;
    
    // 逐个应用清理规则
    formatPatterns.forEach(pattern => {
      cleanedText = cleanedText.replace(pattern, '');
    });
    
    // 清理多余的空格和标点
    cleanedText = cleanedText
      .replace(/\s+/g, ' ')
      .trim();
    
    return cleanedText;
  }

  /**
   * 生成署名建议（废弃，现在由AI直接生成具体出处）
   * @param {string} quote - 金句内容
   * @returns {Promise<string>} 建议的署名
   * @deprecated 现在由AI直接生成具体出处
   */
  async generateSignature(_quote: string): Promise<string> {
    // 这个方法现在主要作为后备，如果AI没有生成出处时使用
    const fallbackSignatures = [
      '经典语录',
      '智慧名言',
      '人生感悟',
      '经典名句',
      '智者语录',
      '生活哲理',
      '人生箴言',
      '心灵鸡汤'
    ];
    
    return fallbackSignatures[Math.floor(Math.random() * fallbackSignatures.length)];
  }

  /**
   * 获取指定主题的所有默认金句（用于测试或展示）
   * @param {CardTheme} theme - 金句主题
   * @returns {QuoteData[]} 该主题的所有默认金句
   */
  getDefaultQuotesByTheme(theme: CardTheme): QuoteData[] {
    return [...this.defaultQuotes[theme]];
  }

  /**
   * 获取所有默认金句的统计信息
   * @returns {object} 默认金句统计信息
   */
  getDefaultQuotesStats(): {[key in CardTheme]: number} {
    const stats = {} as {[key in CardTheme]: number};
    Object.keys(this.defaultQuotes).forEach(theme => {
      stats[theme as CardTheme] = this.defaultQuotes[theme as CardTheme].length;
    });
    return stats;
  }

  /**
   * 发送API请求的核心方法
   * @param {SiliconFlowRequest} requestData - 请求数据
   * @returns {Promise<string>} API返回的内容
   * @private
   */
  private async makeApiRequest(requestData: SiliconFlowRequest): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('API配置未完成，请检查环境变量');
    }

    // 创建一个带超时的fetch请求
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }

      const data: SiliconFlowResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('API返回数据格式错误');
      }

      const content = data.choices[0].message.content.trim();
      
      // 清理可能的引号和多余字符
      return content.replace(/^["']|["']$/g, '').trim();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('API请求超时，请检查网络连接');
      }
      throw error;
    }
  }
}

export const siliconFlowService = new SiliconFlowService(); 