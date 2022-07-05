import { ReplyReview, UpdateReview } from "@ts-types/generated";
import Base from "./base";

interface InputType {
  model_id: number;
  model_type: string;
}

export interface CreateAbuseReportInput {
  model_id: string;
  model_type: string;
  message: string;
}

class Review extends Base<ReplyReview, UpdateReview> {
  decline = async (url: string, variables: InputType) => {
    return this.http(url, "post", variables);
  };

  reportAbuse = async (url: string, variables: CreateAbuseReportInput) => {
    return this.http(url, "post", variables);
  };
}

export default new Review();
