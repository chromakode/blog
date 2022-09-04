---
layout: ../../layouts/PostLayout.astro
title: Fixing hanging deja-dup S3 uploads
pubDate: July 9, 2014
---

# Fixing hanging deja-dup S3 uploads

After configuring [deja-dup](https://launchpad.net/deja-dup) to back up to [S3](http://aws.amazon.com/s3/), I hit a snag: the process seemed to hang during the upload phase.

To obtain more information, I found that you can enable verbose output via an environment variable (why it isn't a verbose command-line parameter is a mystery to me):

    DEJA_DUP_DEBUG=1 deja-dup --backup

The first S3 upload would start and hang, eventually printing the error:

    DUPLICITY: . Upload 's3+http://[...].vol1.difftar.gpg' failed (attempt #1, reason: error: [Errno 104] Connection reset by peer)

It turns out that this is a transient error for new S3 buckets while the DNS changes propagate through AWS ([reference](https://code.google.com/p/s3ql/issues/detail?id=363#c13)). Indeed, the full error contents of `curl`ing the bucket described a temporary redirect, which was probably not being handled properly by deja-dup/duplicity/python-boto. After waiting about an hour, the problem was resolved and my backup process went smoothly.

---

As a side note, after tinkering with the IAM profile a bit, this is the minimal set of permissions I could find for the duplicity account:

```json
{
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::BUCKETNAME"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::BUCKETNAME/*"
    }
  ]
}
```
