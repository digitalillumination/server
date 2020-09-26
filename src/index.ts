import app from "./app";
import envs from "./envs";

const PORT = envs.PORT;

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});