export * from "./generated/api";

// `generated/types` re-exports one TS type per component schema *and* per
// operation body/params object that isn't a $ref'd component. The latter
// occasionally collides: when an operation mixes path + query params, or has
// an inline (non-$ref) request body, orval's typescript generator and its zod
// generator independently derive the same name for that object, colliding
// with the same-named runtime const already exported from `generated/api`
// above (e.g. AdminUpdateLeadStatusBody, GetArticleBySlugParams). Those two
// are dropped here rather than re-exported — use `z.infer<typeof X>` on the
// zod schema from `generated/api` instead. If codegen adds a new collision,
// `pnpm run typecheck` will fail with "already exported a member named X";
// add it to the exclusion list below.
export type {
  AdminListLeadsParams,
  AdminUser,
  ArticleDetail,
  ArticleDetailStatus,
  ArticleSummary,
  CreateLeadRequest,
  ErrorResponse,
  HealthStatus,
  Lead,
  LeadStatus,
  ListArticlesParams,
  Locale,
  LoginRequest,
  UpsertArticleRequest,
  UpsertArticleRequestStatus,
  UpsertArticleRequestTranslationsItem,
} from "./generated/types";
