/* eslint-disable @typescript-eslint/no-explicit-any */
import bcryptjs from "bcryptjs";
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { IIsActive, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { envVars } from "./env";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
          return done("User dose not exist...");
        }

        if (isUserExist.isVerified == false) {
          return done(`User is not verified...`);
        }

        if (
          isUserExist.isActive === IIsActive.BLOCKED ||
          isUserExist.isActive === IIsActive.INACTIVE
        ) {
          return done(`User is -> ${isUserExist.isActive}`);
        }

        if (isUserExist.isDeleted) {
          return done(`User is deleted...`);
        }

        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider == "google"
        );

        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(null, false, {
            message:
              "You have authorize with google.. If you want to login with email and password, set a password first.",
          });
        }

        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          isUserExist.password as string
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log("error from local strategy ->", error);
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(null, false, {
            message: "no email found",
          });
        }
        let isUserExist = await User.findOne({ email });

        if (isUserExist && !isUserExist.isVerified) {
          return done(null, false, { message: "User is not verified..." });
        }

        if (
          isUserExist &&
          (isUserExist.isActive === IIsActive.BLOCKED ||
            isUserExist.isActive === IIsActive.INACTIVE)
        ) {
          return done(`User is -> ${isUserExist.isActive}...`);
        }

        if (isUserExist && isUserExist.isDeleted) {
          return done(null, false, { message: "User is deleted..." });
        }

        console.log("Creating new user with data:", {
          email,
          name: profile.displayName,
          picture: profile.photos?.[0]?.value,
        });

        if (!isUserExist) {
          isUserExist = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, isUserExist);
      } catch (error: any) {
        console.log("error from passport.ts", error.message || error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(
  async (
    id: string,
    done: (err: any, user?: false | Express.User | null | undefined) => void
  ) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      console.log("error from passport deserializeUser ", error);
      done(error);
    }
  }
);
