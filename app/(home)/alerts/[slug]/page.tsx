import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { AlertDetailView } from "@/components/alerts/detail-view"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_ALERT_RULE_DETAILS, GET_SESSION, LIST_ALERT_HISTORY } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import {
  alertDetailSearchParamsSchema,
  type GetAlertRuleDetailsResponse,
  getAlertRuleDetailsResponseSchema,
  type ListAlertHistoryResponse,
  listAlertHistoryResponseSchema
} from "@/lib/schemas/alerts"
import { slugRequestParamsSchema } from "@/lib/schemas/common"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"

export const metadata: Metadata = createPageMetadata({
  title: "Alert Details",
  description: "View alert rule details and history"
})

interface AlertDetailsPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AlertDetailsPage({ params, searchParams }: AlertDetailsPageProps) {
  const requestParams = await params
  const searchParamsObj = await searchParams

  const { success, data: validatedParams } = slugRequestParamsSchema.safeParse(requestParams)
  if (!success) {
    return notFound()
  }

  const { data: validatedSearchParams } = alertDetailSearchParamsSchema.safeParse(searchParamsObj)
  const openDelete = validatedSearchParams?.delete ?? false
  const cursor = validatedSearchParams?.cursor ?? null

  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(GET_SESSION, sessionResponseSchema, {
    headers: {
      Cookie: cookieStore.toString()
    }
  })
  const redirectSearchParams = new URLSearchParams()
  const redirectPath = `/alerts/${validatedParams.slug}${openDelete ? "?delete=true" : ""}`
  redirectSearchParams.set("redirectTo", redirectPath)
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  const [ruleDetails, alertHistory] = await Promise.all([
    axiosGetInstance<GetAlertRuleDetailsResponse>(
      GET_ALERT_RULE_DETAILS,
      getAlertRuleDetailsResponseSchema,
      {
        headers: { Cookie: cookieStore.toString() },
        params: { ruleId: validatedParams.slug }
      }
    ),
    axiosGetInstance<ListAlertHistoryResponse>(LIST_ALERT_HISTORY, listAlertHistoryResponseSchema, {
      headers: { Cookie: cookieStore.toString() },
      params: {
        ruleId: validatedParams.slug,
        cursor
      }
    })
  ])

  return (
    <AlertDetailView
      rule={ruleDetails.data}
      history={alertHistory.data || []}
      cursor={alertHistory.cursor}
      prevCursor={alertHistory.prev_cursor}
      openDelete={openDelete}
    />
  )
}
