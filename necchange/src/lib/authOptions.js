import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const authOptions = {
  adapter: PrismaAdapter(prisma),

  pages: {
    signIn: "/auth/signin",
    signOut: "/",
  },
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token }) {
      // Add role to session provided from useSession
      session.user = token;
      //session.user.role = token.role
      //session.user.number = token.number

      return session;
    },
  },
  session: { strategy: "jwt" },
  events: {},
};

import { createTransport } from "nodemailer";
import Mailjet from "node-mailjet";
import NeccSticker from "../../public/neccSticker.png";

async function sendVerificationRequest(params) {
  const { identifier, url, provider, theme } = params;
  const { host } = new URL(url);

  const file = process.cwd() + "/neccSticker.png";

  const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC || "your-api-key",
    apiSecret: process.env.MJ_APIKEY_PRIVATE || "your-api-secret",
  });

  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "dev@necc.di.uminho.pt",
          Name: "NECC",
        },
        To: [
          {
            Email: identifier,
          },
        ],
        Subject: `Sign in to ${host}`,
        TextPart: text({ url, host }),
        HTMLPart: `<div style="background-color:#f9f9f9;display:flex;justify-content:center;flex-direction:column;align-items:center">
          <div style="background-color:#fff ;width:70%;display:flex;justify-content:center">
            <img style="height:150px; width:150px" src=\"cid:id1\"/>
          </div>
          <div style="width:70% ;background-color:#fff">
            ${html({ url, host, theme })}
          </div>
        </div>`,
        InlinedAttachments: [
          {
            ContentType: "image/png",
            Filename: "neccSticker.png",
            ContentID: "id1",
            Base64Content:
              "iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAMAAAD8CC+4AAAAFVBMVEVMaXEAjMoAjMoAjMsAjMoAi8gAjMqG8GsMAAAABnRSTlMAkdIXYTfTrzI/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAPN0lEQVR4nO2d15ajOhAAaQX+/5PvmZm7NkHCVhZ01dvOWZMKdRBpWQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7oJ1TkSc83b0lkAvrKwvjDjPkVeBvK3/mnejNwj6W1+NI9I/H2+O2mX0JkFz7NH6akjuCq2vDPb7Y/1vaybGiARydsC6IbPfGO/knLSPNbo9Scf6bfEn4ZEa3Qf+D4n9ScZDadutZ+jZb4a9Nn6u0Y/9+g+M9Rth3Ufjf4N9G+OxfmdcSF9ksNvLEp5q7jFhPZbZQ8WcGbkvUDOsR6yHIgSzNDebRP8OuQzwFHMT479P5HHrob6NqbkHhfWg9dBiCPATYhOq9QjuqpZbmYV/UFgPzcKElkYFP+0tbkW8Enfgygu13I078kteo5mh/tjSLX6tlaH+7ES+/tgWd7jIGmrbKOAfYdycbf8jFEIo4O8c1s2v7EuHDPWpsJkTreuvbPn22aXQ7xnqdwvr7npoHwmth5tobtafmdR1BZZBKXezRG5S1xca6sT3m3XkS+oqA8tgqN+sP7Opaw2sFOk3m1r3qSsOdW3E93tNtLrkdddYCAybaM3zFVg7F1hvZHzNycehoU58v8kV0+xBGtgG4vstrpi+SN+QwH1T1O9NyJ9a/0BGZA48sd5il5Xz4RnT3tKlylKgf1gvScd1lgLdw3qJrvNQJ6nPXK1X0XUu5Ujqdxnk+WP0vGUk9SoEHxmsj8nZtvMEPC+mqGS9i/Q1a9tOJyRJvRLBp8eqY5capRxJvRahy5jVcXWiEEm9FjKr9OW0ZST1O1mXOqmH6Zk7WZelSilHJXcn66bOdlHJ3cr6slQp5ajk7mTd1tkskvqdrPulSimH9DtZd0uVUo5K7k7WXaWpo8r7DC0vvkji4fWRK0JUcje65CaJ2yKR+ENSj8mTzA8ZNrRuUqX7cCmH9KvbImQy60sa7nWW7DeJ6Zngwfp3eCazbtM2xK+RoU5SjyufzrpP3I735hctR939blNZd4nb8R7T+1KOpL6zVeme4UbWJXEzzFtv+T6pmlqZyLok70+4a6OS+yhqHusmWforvu9n5XL2SNl9bvNYX5J36RXfd5tD+f551nwa6zZZugme01RyH53PY92nbcFPex588z+V3Gfn01h3iRuw/cl2Y6jkvroiOod1SdyArd/drFzO3ii8Cj6FdUlcv9nWAdttoZL77vmUGaybjLNZQkNdfSX37fOHM1hf0qW/T5TSfXkSX2uR8Q832owYFvpem/ZKLuHhw/HWfca+SSikLapJerh8uHWXs3OhUk731dW0+1dHW3eJq97/aLMhqiu5yECPvjhosHVJXLPZJ/D3Xqmu5CIDXeyc1iVxxWYf3997q7mSi2V0t9S17gY26uFWXfH0TCyjyzKp9SVn/0xgfxVXcldip7Rus9Zqz0NdbyUXzbW/XqPW3TjrPmsH36fpfg9VEhXxFxAntO7yapZzfNdbyUWb9P8PyXzWJXGdxwDxrlzVVnLxmZmlhXUZ1bOtct4GtUk9fq3FTmrdZK7xXMqpTerxg/s6SFHrfoh1k7nC9zn6b3+QfqF0MutLXh1hLv6ijPixdV9chxti3aatzp9DV+aSHkP82Mo33fwI6y5tbS/F51JO65zcd9Knsu4yd9GczgOt5Xu8et9nvJh1U+cd7B16tu0JanQn9W+lT2Rdctclp1Ju0cnFPZHLpNZN9qrscbeVVnIXB9/Oan3Jnft1x78pTeoXx959O3Pe27pNW9F7s0+lnNLpmYtLIOdhMIl1n7aezSyDjd5boYqLe9cCw2AO6y5bujvu96KTJOlzWHfZu2iiN0zqIn7gg7FvBuuS36HYw44oreQukrpN8dTRuuSvRA5BX2klZ1MLpvHWTcE6DqWcUukX0zOR2Dfeus0PZodSTmn5nvEisYtb5ftY9/l7KIezXWklF4/vUYmjrbuCPbT7oa60kovH93jsG2zdJa4g8lujWHo8vi99rFvTr2fbnslOcVKPx3c7qXVJXL5E7v37+eeiFJNTMI20bhIXv9vWQymntJKLx/fLhDfS+lKwg5szxitO6tH4fn1ABlq3JWf1Jn4ZvdMzl48r1/9ZBesucdmxzfOKpceur344IHaYdZe46GicMGrL9+j11U/yhlmXxEWb2Cmz+fKDOiLp+eMoGGVdivZvs1tW7xMPsfj+OfQNsm7KTupdfNdavkdrsmVW60tRU7or5fQm9Uir/kW+q/v4uu/Rsx2GutqkHmnVv8l3Q6z7sqVufi56k3qklPvK24jX0riyc3pXyulN6q4gMQ+w7hIXevz9JqSL2umZSKv+5fHo/1oaSVymuXjjgt5KLnyovz0e3V9QIoWL3O6YqK3kIhXUMql1U7rEjWivV3q4Vf/6ePR+VcVSWCgoTuQfC6jvk3Jn67Zw5xQn8o+tekIl1te6L905vd35x/guNXqtFtZd4uKK9uzBhIZq0qHp+eiLFJ/ROdukI76npb6O1qV4YcT36FFeJrVuipdFKReN72m2ou16fetLGoGCQ3F7vqW8YIqW8NWt22Lpei+0fDrGxVVyK+u++GwkvsdKufIquZF1Ka9SKeUiyupJr23dpy2n/Lx5Kq5BldzKurHFZ2PO5jyPQBCs2VyPtC6BJRDfI+OhvEqew7oLLID4Hilyi69slFu3NW6zDp6NtOq/tOvZBlv3od/TqodDacXyfah1W3jSPI7tvUOtpQ+zbkI/Vxzft0fu5Ch1Weuk1qXsnHkc2/tBr+4brSN9kHUJbsqiFnEX8b1qzzbQugv+WG+r7rYnvKn0wcMr6j7S6po/w/NE7PaEd3UfG5vGug3/Vm8pd3g5Q8tGfZz1Nf+nj2T3kLZp3LONsm6Cv9RbysnhPVsldr59va/0th75qdr47g8vZygZCl+/01lytrTgobnIhqkt5exuqBxKuSZvFfjB9bWe+wqtx7J7iV78XXt1pa99rcc2TG2rvn+JXvRde/V6thLra569mHS18d0dX5laYCZB+po1yqLzPzYvBGkt5dx+34tGghlm3dh+j9U+ALuXG3srfoNPsvhu1qNpQW0pF/iQUe4xSfwOj+9mPboJWuP74ctFu2OyNCvf863nfPM1mne0TsUevlwkfXq2vtajIUhrfPcX8b38sbEP2D7W43lHaXy3oW9Stm/US26HT7YeD0Fa4/vhy6OR75N+xTqpdRdf/6IT2Z/xtlej3vHRl4sQpDS+u8MZb7r1bP2sR/633vjuDjWb6yt97WE9HoKUzr/b48537NlaWE/5z3qT+t8wsKEj1OKG2NbWJS0EKZ1/l8Ox8h17tk7WL0KQ0qT+/8ELZcCWF1d7Wr8IQUqTujsKdj17ti7WL0KQ0qRuj3tvO11c7Wg98v/0Sv83Pu15wHbp2XpYvwhBi07+P3KhUm7p0bN1sF7vDZRPwZ12P/eIlEhfW1pH+pF/A9udj1Hzi6vl1r96kPnibFQ60u0pg/vOjXrzx9cvpCudnXkNFn/6S69GvbX1i7NRq3Q5HaXzXxo36q2tR/6HYumv4GePI6Nfo97YevxsVJrT3yn8dJA6NuptrcelL0p5Z7yLNq59z9bSelS61hm5zSHxx/PAd5e+Zmn4ZJ27oE/I+YDLiJ6txUsLpOqHIh7Ee4D6Q57v3LM1sx4NQUqvp+9m0t7He0zP1so6jyufj9f7CEVvqOkpfa3+MqLYBLHe6B68WcYN6tnaWI9J1xvdt67elv+OYPaC5rLuw3/X27DtU57d/61/o15kfY0QORk1D/Rt9JP9Aex6cbXcetr6VQ/08BMOZlSj3s261nn3/9kkQ7c7fu2fXB1nXXPp/oMEYt7x0fWePVsP68qD+74A89szYVTP1sG68uAeeSzdD5e+NrSuPbgfcvFrCAzt2Rpbx/l+hMr2j4Olr42s4zz2LjE/tmdraB3npxH6KuXMoIurra3j/HyQJPyS6P49W8Fk6ZV1nIdk/RvqdsANse2tq55x3xF+AfTuyw/py5nRulHfn8dkbQ7cMrh8r2ydYR6VtYnvo3u2qta3nxSGQ6/1CuqSenG1fs9W7/XwRuszTFH2x+ff4XET9GyVrKP8U6/1r5SzydLNXNYNyr9Pxv+Sn8zQsxVY/7tvTgjsQSKfWrVT9Gwl1sVQvkUPzrrnJXGZonz/hfFam0MyfnVtE0lf6bgqI3XuJqp4Q+wZptMq4+rE0laN+h9Yr4uvNGG5NsUQ4WtiKx3eZo36H1iviqkT3xv2bL9gvSZHW2ZO6SvWK3JqtvKGetOe7Res18PXua2ovfQV69U4NVtmwp7tD6xXw9SZ7F47IPX2WjlSZ6g37tn+wHolzjOoVV+8XxeptdfKsXWObB/pK5fc6mCqDPUO5fvKbRHVOI9RN2ejLszAV+Osy8x2cXVlkFfGVsmcTXs24xnkzZN6zlBvZ1wwXp9A4W2nadSFer0JgRpM5ujZDMZbEUrHdrx04wjrDQlEZj+4ZzMk8sYEBqkZ2rMJYX1IfPfDejaD8VHxPb2Uq2Pckcg7EcrHdkDPJgzyfoTyse8tXTDeF1OhlCvq2QwTrVPEd99NuiGRjyBUeqcMdWudyw3vQuk2CJM51K13IiY/nQuJfK5S7mqoW+9+bGfL/oVEfpOhbp0rGdlvmGids5STcyBfKyGE9RkIqXmZya7SMD41cpXVK15CM/Rn8xC8YOIqXy039Gdz4a6eGYx+xjYFIZFPR2g0v7/CytT6IwneBmGrXC83JPJb1nL5t8aQyGcmGMJ9oXUS+R0nY+35ldoYVzQvl1bNkchvnNY3jZb9vl8nrN+G0FjeveDnuwlZrp/d3/ruP3wc7IT1R1jf3w99mdkx/lDri4+MdozfllAAP76RxLrDtXUjwqzbrQlYD1wrsU5+cM5x//JDQzzfK30+dd45BXfP7NwAoVE7r2HWgD2W6DyMogO/bc54YYAmrPc/nRkjHQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJab8h+HwpbOk1fV8AAAAABJRU5ErkJggg==",
          },
        ],
      },
    ],
  });

  request
    .then((result) => {
      console.log(result.body, "Email sent");
    })
    .catch((err) => {
      console.log(err.statusCode, "Error sending email", err);
    });

  // NOTE: You are not required to use `nodemailer`, use whatever you want.
  //   const transport = createTransport(provider.server);
  //   const result = await transport.sendMail({
  //     to: identifier,
  //     from: provider.from,
  //     subject: `Sign in to ${host}`,
  //     text: text({ url, host }),
  //     html: `
  //     attachments: [
  //       {
  //         filename: "image.png",
  //         path: file,
  //         cid: "unique@nodemailer.com", //same cid value as in the html img src
  //         contentDisposition: "inline",
  //       },
  //     ],
  //   });
  //   const failed = result.rejected.concat(result.pending).filter(Boolean);
  //   if (failed.length) {
  //     throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  //   }
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params) {
  const { url, host, theme } = params;

  const brandColor = theme.brandColor || "#346df1";
  const color = {
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  };

  const redirect = process.env.NEXTAUTH_URL + "/auth/captcha?redirect=" + url;
  // console.log("Redirect", redirect);
  return `
<body>
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td style="font-size: 18px; font-family: Helvetica, Arial, sans-serif">
        <h5>Dear student,</h5>
        To enhance your account security, we require a quick verification process.Please click the button below to proceed:
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>necchange.necc.di.uminho.pt</strong>
      </td>
    </tr>
    <tr>  
      <td align="center" style="padding: 10px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}">
              <a href="${redirect}"
                 target="_blank"
                 style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">
                Sign in
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 30px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
        <br>
      </td>
    </tr>
  </table>
</body>
  `;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }) {
  return `Sign in to ${host}\n${url}\n\n`;
}
