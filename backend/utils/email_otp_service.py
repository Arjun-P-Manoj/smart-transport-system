import random
from datetime import datetime, timedelta
from flask_mail import Message
from db.database import get_db_connection
from extensions import mail


def generate_otp():
    return str(random.randint(100000, 999999))


def send_email_otp(email):

    otp = generate_otp()

    conn = get_db_connection()
    cur = conn.cursor()

    expiry = datetime.utcnow() + timedelta(minutes=5)

    cur.execute("""
        INSERT INTO email_otp (email, otp, expires_at)
        VALUES (%s,%s,%s)
        ON CONFLICT (email)
        DO UPDATE SET otp=%s, expires_at=%s
    """, (email, otp, expiry, otp, expiry))

    conn.commit()

    cur.close()
    conn.close()

    msg = Message(
        subject="Smart Transport OTP Verification",
        sender="smarttransport.demo@gmail.com",
        recipients=[email]
    )

    msg.body = f"""
Your OTP for Smart Transport registration is:

{otp}

This OTP will expire in 5 minutes.
"""

    mail.send(msg)

    return True


def verify_email_otp(email, otp):

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT otp, expires_at
        FROM email_otp
        WHERE email=%s
    """, (email,))

    row = cur.fetchone()

    cur.close()
    conn.close()

    if not row:
        return False

    stored_otp, expiry = row

    if datetime.utcnow() > expiry:
        return False

    return stored_otp == otp