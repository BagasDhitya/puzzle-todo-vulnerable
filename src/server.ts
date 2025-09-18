import { createApp } from "./app";

const app = createApp();
const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, () => {
    console.log(`PUZZLE VULN TODO demo running on http://localhost:${PORT}`);
});
