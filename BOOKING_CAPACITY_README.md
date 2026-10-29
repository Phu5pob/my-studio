# Booking capacity — Development first

## Included
- Admin can change the capacity of an existing schedule in `/admin/courses`.
- Admin sees active bookings / maximum capacity.
- Course details and booking form show remaining seats and disable full schedules.
- Active occupancy = `pending` + `confirmed`; `cancelled` and `completed` do not reserve a seat.
- Server-side booking already calls `book_course_atomic()` and handles `SCHEDULE_FULL`.

## Required setup
1. Select **Neon development** branch, never production for the initial test.
2. Run `sql/booking-capacity-development.sql` in the SQL Editor.
3. Inspect the printed definition of `book_course_atomic()` and confirm it locks the selected `schedules` row using `SELECT ... FOR UPDATE` before checking `max_students`, counts only `pending` and `confirmed`, and creates a booking while still holding that lock. If it does not, **do not consider capacity enforcement safe**: the frontend display alone does not prevent concurrent overbooking. Ask for help adapting the existing function before rollout.
4. Deploy this code to Preview and test with a schedule capacity of 2 using three different student accounts. Check cancellation and concurrent booking.
5. Only after successful verification, apply the SQL function and deploy code to Production.

Do not add `DATABASE_URL`, `.env` or secrets to this zip.
