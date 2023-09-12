export default class Config {
    static getPortName(): string {
        return "GITHUB_PR_REVIEWS_PORT";
    }
    static getPollInterval(): number{
        return 2000;
    }
}
