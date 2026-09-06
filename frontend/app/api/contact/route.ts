import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Nama, email, dan pesan wajib diisi.' },
        { status: 400 }
      );
    }

    const gmailUser = process.env.GMAIL_USER || 'marwanwisnu06@gmail.com';
    const gmailPass = process.env.GMAIL_PASS || 'tqihnajqdavedhpj';
    const targetEmail = process.env.CONTACT_TARGET_EMAIL || 'merintisdigital@gmail.com';

    // Inisialisasi Transporter Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const emailSubject = `[Kelana AI] Pesan Kontak: ${subject || 'Pertanyaan'} - ${name}`;

    const htmlContent = `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #F4EFE6; padding: 32px 16px; color: #1A1612;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid rgba(26,22,18,0.08);">
          <div style="background-color: #1A1612; padding: 24px 32px; border-bottom: 3px solid #E85D2F;">
            <h1 style="color: #F4EFE6; margin: 0; font-size: 20px; letter-spacing: 0.5px;">Kelana AI — Pesan Baru</h1>
            <p style="color: rgba(244,239,230,0.7); margin: 6px 0 0 0; font-size: 13px;">Pesan masuk dari formulir kontak situs web</p>
          </div>
          
          <div style="padding: 32px;">
            <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #ECE7DE;">
              <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6B5D4F; font-weight: bold;">Pengirim</p>
              <p style="margin: 0; font-size: 16px; font-weight: bold; color: #1A1612;">${name}</p>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #E85D2F;">
                <a href="mailto:${email}" style="color: #E85D2F; text-decoration: none;">${email}</a>
              </p>
            </div>

            <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #ECE7DE;">
              <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6B5D4F; font-weight: bold;">Subjek</p>
              <p style="margin: 0; font-size: 15px; font-weight: 600; color: #1A1612;">${subject || 'Pertanyaan Umum'}</p>
            </div>

            <div style="margin-bottom: 24px;">
              <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6B5D4F; font-weight: bold;">Isi Pesan</p>
              <div style="background-color: #FDFCFA; border: 1px solid #ECE7DE; border-radius: 12px; padding: 18px; font-size: 14px; line-height: 1.6; color: #1A1612; white-space: pre-wrap;">${message}</div>
            </div>

            <div style="padding: 16px; background-color: #F4EFE6; border-radius: 12px; font-size: 12px; color: #6B5D4F; text-align: center;">
              Anda dapat langsung membalas email ini untuk merespons pengunjung.
            </div>
          </div>

          <div style="background-color: #FAF6F0; padding: 16px 32px; text-align: center; font-size: 11px; color: #6B5D4F; border-top: 1px solid #ECE7DE;">
            © 2026 Kelana AI Travel • Dibuat dengan rindu di Indonesia
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Kelana AI Hubungi" <${gmailUser}>`,
      to: targetEmail,
      replyTo: email,
      subject: emailSubject,
      text: `Pesan baru dari ${name} (${email}):\nSubjek: ${subject}\n\n${message}`,
      html: htmlContent,
    });

    return NextResponse.json(
      { success: true, message: 'Pesan berhasil terkirim ke tim kami.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Gagal mengirim email kontak:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengirim email.' },
      { status: 500 }
    );
  }
}
