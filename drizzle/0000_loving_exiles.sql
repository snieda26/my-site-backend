CREATE TYPE "public"."experience_level" AS ENUM('BEGINNER', 'JUNIOR', 'MIDDLE', 'SENIOR', 'LEAD');--> statement-breakpoint
CREATE TYPE "public"."learning_goal" AS ENUM('JOB_INTERVIEW', 'SKILL_IMPROVEMENT', 'CAREER_GROWTH', 'KNOWLEDGE_REFRESH', 'CERTIFICATION');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."target_position" AS ENUM('JUNIOR', 'MIDDLE', 'SENIOR', 'LEAD');--> statement-breakpoint
CREATE TYPE "public"."difficulty" AS ENUM('EASY', 'MEDIUM', 'HARD');--> statement-breakpoint
CREATE TYPE "public"."solve_status" AS ENUM('ATTEMPTED', 'SOLVED');--> statement-breakpoint
CREATE TYPE "public"."progress_status" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar(255),
	"avatar_url" varchar(512),
	"email_verified" boolean DEFAULT false NOT NULL,
	"verify_token" varchar(128),
	"role" "role" DEFAULT 'USER' NOT NULL,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_email_unique" UNIQUE("email"),
	CONSTRAINT "accounts_verify_token_unique" UNIQUE("verify_token")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"account_id" varchar(128) NOT NULL,
	"experience_level" "experience_level" DEFAULT 'JUNIOR' NOT NULL,
	"target_position" "target_position" DEFAULT 'MIDDLE' NOT NULL,
	"years_of_experience" integer,
	"learning_goal" "learning_goal" DEFAULT 'JOB_INTERVIEW' NOT NULL,
	"weekly_hours" integer,
	"technologies" text[] DEFAULT '{}' NOT NULL,
	"focus_areas" text[] DEFAULT '{}' NOT NULL,
	"preferred_language" varchar(10),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_account_id_unique" UNIQUE("account_id")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name_en" varchar(255) NOT NULL,
	"name_ua" varchar(255) NOT NULL,
	"description" text,
	"icon" varchar(50),
	"color" varchar(50),
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title_en" varchar(500) NOT NULL,
	"title_ua" varchar(500) NOT NULL,
	"description_en" text,
	"description_ua" text,
	"content_markdown_en" text NOT NULL,
	"content_markdown_ua" text NOT NULL,
	"difficulty" "difficulty" DEFAULT 'MEDIUM' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"prev_slug" varchar(255),
	"next_slug" varchar(255),
	"category_id" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "questions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "questions_to_tags" (
	"question_id" varchar(128) NOT NULL,
	"tag_id" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"logo" varchar(512),
	CONSTRAINT "companies_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "problems" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text NOT NULL,
	"difficulty" "difficulty" DEFAULT 'MEDIUM' NOT NULL,
	"starter_code" text NOT NULL,
	"solution" text NOT NULL,
	"test_cases" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "problems_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "problems_to_companies" (
	"problem_id" varchar(128) NOT NULL,
	"company_id" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problems_to_tags" (
	"problem_id" varchar(128) NOT NULL,
	"tag_id" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solved_problems" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"account_id" varchar(128) NOT NULL,
	"problem_id" varchar(128) NOT NULL,
	"code" text NOT NULL,
	"status" "solve_status" DEFAULT 'ATTEMPTED' NOT NULL,
	"solved_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "solved_problems_account_problem_unique" UNIQUE("account_id","problem_id")
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"account_id" varchar(128) NOT NULL,
	"question_id" varchar(128),
	"problem_id" varchar(128),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bookmarks_account_question_unique" UNIQUE("account_id","question_id"),
	CONSTRAINT "bookmarks_account_problem_unique" UNIQUE("account_id","problem_id")
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"account_id" varchar(128) NOT NULL,
	"category_id" varchar(128),
	"question_id" varchar(128),
	"status" "progress_status" DEFAULT 'NOT_STARTED' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_progress_account_question_unique" UNIQUE("account_id","question_id")
);
--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions_to_tags" ADD CONSTRAINT "questions_to_tags_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions_to_tags" ADD CONSTRAINT "questions_to_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problems_to_companies" ADD CONSTRAINT "problems_to_companies_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problems_to_companies" ADD CONSTRAINT "problems_to_companies_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problems_to_tags" ADD CONSTRAINT "problems_to_tags_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solved_problems" ADD CONSTRAINT "solved_problems_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_email_idx" ON "accounts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_profiles_account_id_idx" ON "user_profiles" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "questions_category_id_idx" ON "questions" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "questions_slug_idx" ON "questions" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "questions_difficulty_idx" ON "questions" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "questions_to_tags_pk" ON "questions_to_tags" USING btree ("question_id","tag_id");--> statement-breakpoint
CREATE INDEX "problems_slug_idx" ON "problems" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "problems_difficulty_idx" ON "problems" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "problems_to_companies_pk" ON "problems_to_companies" USING btree ("problem_id","company_id");--> statement-breakpoint
CREATE INDEX "problems_to_tags_pk" ON "problems_to_tags" USING btree ("problem_id","tag_id");--> statement-breakpoint
CREATE INDEX "solved_problems_account_id_idx" ON "solved_problems" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "solved_problems_problem_id_idx" ON "solved_problems" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "bookmarks_account_id_idx" ON "bookmarks" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "user_progress_account_id_idx" ON "user_progress" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "user_progress_category_id_idx" ON "user_progress" USING btree ("category_id");