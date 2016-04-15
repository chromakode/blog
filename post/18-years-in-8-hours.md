# Backing up 18 years in 8 hours

![Computer guts](/post/18-years-in-8-hours/workspace.jpg)

This winter, while home visiting family, I took the opportunity to gather up all of my old hard disks and archive them. This amounted to the majority of my digital footprint for the first 18 years of my life. I'd been putting the task off for a few years, but the chance to explore the data sitting on these old drives (and the cherished computers they came from!) helped motivate this project.

When I was a teenager, whenever a hard disk needed replacement, I'd pull the old drive and shove it in my closet. There they sat, some for over a decade, until I turned them back on last month. Amazingly, across ~350GB of data, only about 500KB proved unrecoverable. Quite fortunate, considering that some of these drives were 15 years old, and one was removed with failing health checks.

In the process of recovering this data, I resolved to preserve it for the rest of my lifetime. Why go to all this trouble? Well, in my explorations of these old drives, I discovered far more meaningful memories than I expected. Old music and 3D renders, chat logs, emails, screenshots, and *tons* of old photos. The disks from the early 2000s were a reminder of the days when computer use gravitated around "My Documents" folders. Then I learned about Linux and always-on internet access arrived. I took a peek at my first homedir and found all of the little Python scripts I wrote as I learned to work on the command line.

By today's standards, the breadth and fidelity of these scraps is rather... quaint. A kid growing up today should have a fine pixel-perfect view of most of their digital trail as they grow up. That was another reason this project proved interesting: it was not just a record of how computers changed; it revealed how the ways I used computers and what they *meant* to me changed over time.

---

Here's a brief rundown of the tools and backup process I used, both because they will be useful to refer back to decades from now, and because they may perhaps be useful to others in their own backup tasks:

## Archival process

### IDE HDD -> USB -> Laptop -> External USB HDD

I used a [Sabrent USB 2.0 to IDE/SATA Hard Drive Converter (USB-DSC5)](http://www.amazon.com/gp/product/B000HJ99DI) to connect the drives to my laptop. I've found this to be a really handy (and cheap!) swiss-army knife for recovering old hard drives, especially since it works on both 3.5" and 2.5" drives. To store the recovered data, I used a [2TB WD My Passport USB Hard Drive (WDBBKD0020BBK-NESN)](http://www.amazon.com/gp/product/B00W8XXYSM). I've had good experiences with these drives in the past, and they have a great form factor. I ordered both items from Amazon and received them a couple days into my trip.

### Reading data from the drives

To recover data from the drives, I used [`ddrescue`](https://www.gnu.org/software/ddrescue/). This is an imaging tool like `dd` that will record read errors and exhaustively retry the surrounding areas. Recovering a drive looked like this:

Copy data from `/dev/sdc` to `disk.img` (outputting a log of errors to `./disk-log`):

    $ ddrescue -d -n /dev/sdc ./disk.img ./disk-log

One of my favorite features of `ddrescue` is that you can re-run it at any point to resume where it left off or try to recover more data. In the initial run, I passed `-n` to skip the slow exhaustive scraping process, in hopes of getting as much data off the drives as possible in case they stopped working after running for while. Thankfully, no issues cropped up. If there were read errors during the initial sweep, I re-ran the process with a retry count:

    $ ddrescue -d -r 3 /dev/sdc ./disk.img ./disk-log

In addition, I saved the partition table and [S.M.A.R.T.](https://en.wikipedia.org/wiki/S.M.A.R.T.) data separately:

    $ smartctl --all /dev/sdc > ./smart
    $ fdisk -l /dev/sdc > ./fdisk

With the holidays over and all disks archived, I flew back home with the external HDD in my carry-on bag.

### Cold storage in the cloud

Thanks to the advent of cheap cloud cold storage options like [Amazon Glacier](https://aws.amazon.com/glacier/), [Google Nearline](https://cloud.google.com/storage-nearline/), and [Backblaze B2](https://www.backblaze.com/b2/), it's now very affordable to dump a bunch of full disk images in the cloud. I chose Google Nearline for this task. Amazon Glacier is a bit cheaper (Glacier: $.007 / GB, Nearline: $.010 / GB), but retrievals are complicated to execute and price. Backblaze B2 is even cheaper, but [only uses a single datacenter](https://www.backblaze.com/blog/b2-cloud-storage-frequent-questions/).

Before uploading my backups, I was able to shave off ~100GB (almost 30%!) by compressing with [`lrzip`](https://github.com/ckolivas/lrzip), which is specialized for large files with repeated segments. I also experimented with compressing one of the disk images with [`xz`](http://tukaani.org/xz/), but (as predicted by [`lrzip`'s benchmarks](https://github.com/ckolivas/lrzip/blob/master/doc/README.benchmarks)) `xz` took 22% longer to produce a file 10% larger.

After compressing the images, I encrypted them with AES256 using [`gpg`](https://www.gnupg.org/). While I've typically used the default CAST5 cipher in the past, for this project I chose AES256 based on [this guide](http://www.tutonics.com/2012/11/gpg-encryption-guide-part-4-symmetric.html). I considered generating a keypair for these backups: my plan was to create copies of the private key encrypted with a couple different passwords given to family members, etc. I decided to defer this because I didn't fully understand the crypto details and wanted to get uploading, so I ended up symmetrically encrypting the files. I may revisit this later and re-upload with a more granular key system.

Putting it all together, I assembled everything into a pipeline and ran it overnight:

    for n in $(ls); do
      pushd $n
      lrzip -vv $n.img
      tar cv $n.img.lrz $n-log fdisk smart | pv | gpg --passphrase="$PASSPHRASE" --no-use-agent --symmetric --cipher-algo AES256 | gsutil cp - gs://$BUCKET/$n.tar.gpg
      popd
    done

Waking up to ~250GB of memories neatly packed up and filed away was a lovely sight. I've been sleeping better since!

At my friend davean's suggestion, since `lrzip` is a less common program, I also uploaded a copy of the git tree to my Nearline bucket.

I also encrypted the files on my local HDD: while I used the out-of-box NTFS filesystem on the My Passport drive for the disk images in transit, once I had a copy of the files in Nearline, I reformatted the drive to [ext4](https://en.wikipedia.org/wiki/Ext4) with [dm-crypt](https://en.wikipedia.org/wiki/Dm-crypt).

Update: an important final step (thanks to [khc on HN](https://news.ycombinator.com/item?id=11502530) for mentioning this): it's critical to test a full restore flow of your backups before leaving them to rest. In my case, I tested downloading from Nearline, decrypting, un-lrzipping, and reading. Similarly, for my local HDD copy, I tested mounting the encrypted filesystem and reading the images.

---

Finally, a word of advice when handling disk drives (and other objects you would not like to fall): objects that are already on the floor cannot fall further. Treat any object that is elevated from the floor like it will fall. You can increase the odds of this happening massively by haphazardly arranging your backup drives on swivel chairs and assorted hardware. ;)
