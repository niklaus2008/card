# 环境变量配置说明

## 🔧 API配置

要使用AI生成金句功能，需要配置硅基流动API。

### 1. 获取API Key

1. 访问 [硅基流动官网](https://cloud.siliconflow.cn/)
2. 注册账号并登录
3. 在控制台获取您的API Key

### 2. 配置环境变量

在项目根目录创建 `.env` 文件：

```bash
# 硅基流动API配置
VITE_SILICONFLOW_API_KEY=your_api_key_here
VITE_SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
```

### 3. 重启项目

```bash
npm run dev
```

### 4. 验证配置

打开应用，点击"AI生成"标签，如果看到主题选择界面而不是配置提示，说明配置成功。

## 🚨 注意事项

- API Key 包含敏感信息，请勿提交到代码仓库
- `.env` 文件已被 `.gitignore` 忽略
- 如果配置后仍显示未配置，请检查环境变量名称是否正确
- 确保API Key有效且有足够的调用次数

## 📞 支持

如有问题，请检查：
1. API Key 是否正确
2. 网络连接是否正常
3. 硅基流动服务是否可用

---

*配置成功后，您就可以享受AI生成金句的便利功能了！* ✨ 